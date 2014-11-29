System.register("spider", [], function() {
  "use strict";
  var __moduleName = "spider";
  function require(path) {
    return $traceurRuntime.require("spider", path);
  }
  "use strict";
  (function() {
    var parser = module.require("./parser"),
        escodegen = require("escodegen"),
        ast = module.require("./ast"),
        traceur = require("traceur"),
        chalk = require("chalk"),
        transfer = require("multi-stage-sourcemap").transfer;
    exports.compile = function(options) {
      var result = {
        errors: [],
        result: null,
        sourceMap: null
      };
      options.fileName = options.fileName == null ? "tmp" : options.fileName;
      var outFileNameWithoutExtension = options.fileName.substring(0, options.fileName.lastIndexOf("."));
      var outFileName = outFileNameWithoutExtension + ".js";
      var mapFileName = outFileNameWithoutExtension + ".map";
      resetVariableNames();
      ast.Node.setErrorManager(new ErrorManager(result.errors));
      var parsed;
      try {
        parsed = parser.parse(options.text);
      } catch (e) {
        result.errors.push(getParsingError(e));
      }
      if (!parsed) {
        return result;
      }
      var tree = parsed.codegen();
      if (options.target !== "ES5") {
        tree = wrapCode(tree, options.useStrict == null ? true : options.useStrict, options.iifi == null ? true : options.iifi);
      }
      var output = escodegen.generate(tree, {
        sourceMap: options.generateSourceMap ? options.fileName : null,
        sourceMapWithCode: options.generateSourceMap,
        format: {quotes: "double"}
      });
      if (options.generateSourceMap) {
        result.result = output.code;
        result.sourceMap = output.map.toString();
      } else {
        result.result = output;
      }
      if (options.target === "ES5") {
        var traceurCompiler = new traceur.NodeCompiler({
          sourceMaps: options.generateSourceMap,
          asyncFunctions: true
        });
        result.result = traceurCompiler.compile(result.result, options.fileName, outFileName);
        if (options.generateSourceMap) {
          result.sourceMap = transfer({
            toSourceMap: result.sourceMap,
            fromSourceMap: traceurCompiler.getSourceMap().toString()
          });
        }
      } else {
        if (options.generateSourceMap) {
          result.result = result.result + "\n\n//# sourceMappingURL=" + mapFileName;
        }
      }
      if (options.verbose) {
        console.log(JSON.stringify(parsed, null, 4));
        console.log(result.result);
      }
      return result;
    };
    exports.formatErrors = function(fileName, content, errors) {
      var output = [];
      var maxCol = 0;
      var maxLine = 0;
      output.push(chalk.white(fileName), "\n");
      var lines = content.split("\n");
      var tabCharacter = "__SPIDER_TAB";
      var errorIndex = 0;
      for (var $__0 = errors[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__1; !($__1 = $__0.next()).done; ) {
        var error = $__1.value;
        {
          var line = error.loc.start.line;
          var column = error.loc.start.column + 1;
          var lineCharCount = line.toString().length;
          var columnCharCount = column.toString().length;
          maxCol = Math.max(maxCol, columnCharCount);
          maxLine = Math.max(maxCol, lineCharCount);
          output.push(tabCharacter);
          output.push(chalk.gray("line", line));
          output.push(tabCharacter, lineCharCount);
          output.push(chalk.gray("col", column));
          output.push(tabCharacter, columnCharCount);
          output.push(chalk.red(error.message), "\n");
          if (typeof error.loc !== "undefined" && error.loc !== null ? error.loc.start : void 0) {
            var start = error.loc.start;
            var end = error.loc.end;
            if (0 < start.line <= lines.length) {
              output.push(tabCharacter, tabCharacter, tabCharacter);
              output.push(chalk.green(lines[start.line - 1].replace(/(\r\n|\n|\r)/gm, ""), "\n", tabCharacter, tabCharacter));
              output.push(chalk.red(generateErrorColumnString(start.column, end ? end.column - 1 : 0)));
            }
          }
          output.push("\n");
          errorIndex++;
        }
      }
      var str = output.join("");
      var tabLength = Math.max(maxLine, maxCol);
      for (var i = 1; i <= tabLength; i++) {
        var regex = new RegExp(tabCharacter + i, "g");
        str = str.replace(regex, generateSpace(Math.max(2 + tabLength - i, 2)));
      }
      return str.replace(new RegExp(tabCharacter, "g"), generateSpace(2));
    };
    function ErrorManager(errors) {
      this.errors = errors;
    }
    ErrorManager.prototype.error = function(e) {
      this.errors.push(e);
    };
    function getParsingError(e) {
      var message;
      if (e.expected) {
        if (e.found) {
          message = "unexpected " + e.found;
        } else {
          message = "unexpected end of input";
        }
      } else {
        message = e.message;
      }
      return {
        type: "SyntaxError",
        message: message,
        loc: {start: {
            line: e.line,
            column: e.column - 1
          }}
      };
    }
    function resetVariableNames() {
      ast.NullPropagatingExpression.resetVariableNames();
      ast.NullCoalescingExpression.resetVariableNames();
      ast.NullCheckCallExpression.resetVariableNames();
      ast.ExistentialExpression.resetVariableNames();
      ast.FunctionExpression.resetVariableNames();
      ast.ForOfStatement.resetVariableNames();
      ast.ForInExpression.resetVariableNames();
      ast.FallthroughStatement.resetVariableNames();
      ast.SwitchStatement.resetVariableNames();
    }
    function wrapCode(tree) {
      var useStrict = arguments[1] !== (void 0) ? arguments[1] : false;
      var iifi = arguments[2] !== (void 0) ? arguments[2] : false;
      if (!!iifi || !!useStrict) {
        var body = [];
        if (useStrict) {
          body.push({
            "type": "ExpressionStatement",
            "expression": {
              "type": "Literal",
              "value": "use strict"
            }
          });
        }
        if (iifi) {
          body.push({
            "type": "ExpressionStatement",
            "expression": {
              "type": "CallExpression",
              "callee": {
                "type": "FunctionExpression",
                "id": null,
                "params": [],
                "defaults": [],
                "body": {
                  "type": "BlockStatement",
                  "body": tree.body
                },
                "rest": null,
                "generator": false,
                "expression": false
              },
              "arguments": []
            }
          });
        }
        tree = {
          "type": "Program",
          "body": body
        };
      }
      return tree;
    }
    function generateSpace(len) {
      var chars = [];
      for (var i = 0; i < len; i++) {
        chars.push(" ");
      }
      return chars.join("");
    }
    function generateErrorColumnString(errorStartIndex, errorEndIndex) {
      var chars = [];
      var i = 0;
      if (!errorEndIndex) {
        errorEndIndex = errorStartIndex;
      }
      for (; i < errorStartIndex; i++) {
        chars.push(" ");
      }
      for (i = errorStartIndex; i <= errorEndIndex; i++) {
        chars.push("^");
      }
      return chars.join("");
    }
  }());
  return {};
});
System.get("spider" + '');
