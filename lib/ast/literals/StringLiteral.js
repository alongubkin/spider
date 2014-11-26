System.register("StringLiteral", [], function() {
  "use strict";
  var __moduleName = "StringLiteral";
  function require(path) {
    return $traceurRuntime.require("StringLiteral", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function StringLiteral(chars, column) {
      Node.call(this);
      this.type = "StringLiteral";
      this.chars = chars;
      this.column = column;
    }
    StringLiteral.prototype = Object.create(Node);
    StringLiteral.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      var elements = [];
      for (var $__0 = this.chars[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__1; !($__1 = $__0.next()).done; ) {
        var value = $__1.value;
        {
          var lastElement;
          if ((typeof value === "undefined" ? "undefined" : {}.toString.call(value).match(/\s([a-zA-Z]+)/)[1].toLowerCase()) === "string") {
            lastElement = elements[elements.length - 1];
            if ((typeof lastElement !== "undefined" && lastElement !== null ? lastElement.type : void 0) === "Literal") {
              lastElement.value += value;
            } else {
              elements.push({
                type: "Literal",
                value: value
              });
            }
          } else {
            if ((typeof value !== "undefined" && value !== null ? value.type : void 0) === "StringLiteralNewLine") {
              lastElement = elements[elements.length - 1];
              if ((typeof lastElement !== "undefined" && lastElement !== null ? lastElement.type : void 0) === "Literal") {
                lastElement.value += value.toString(this.column - 1);
              } else {
                elements.push({
                  type: "Literal",
                  value: value.toString(this.column - 1)
                });
              }
            } else {
              value.parent = this;
              elements.push(value.codegen());
            }
          }
        }
      }
      if (elements.length === 0) {
        return {
          "type": "Literal",
          "value": ""
        };
      } else {
        if (elements.length === 1) {
          return elements[0];
        }
      }
      var reduced = elements.reduce(function(left, right) {
        return {
          type: "BinaryExpression",
          operator: "+",
          left: left,
          right: right
        };
      });
      this.type = reduced.type;
      this.operator = reduced.operator;
      this.left = reduced.left;
      this.right = reduced.right;
      return this;
    };
    StringLiteral.prototype.hasCallExpression = function() {
      return false;
    };
    StringLiteral.NewLine = function(text) {
      this.type = "StringLiteralNewLine";
      this.toString = function(column) {
        var t = text.replace(/\r\n/g, "").replace(/\t/g, "    ");
        if (t.length < column) {
          return "";
        }
        return t.substring(column);
      };
    };
    exports.StringLiteral = StringLiteral;
  }());
  return {};
});
System.get("StringLiteral" + '');
