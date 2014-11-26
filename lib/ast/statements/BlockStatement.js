System.register("BlockStatement", [], function() {
  "use strict";
  var __moduleName = "BlockStatement";
  function require(path) {
    return $traceurRuntime.require("BlockStatement", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function BlockStatement(body) {
      Node.call(this);
      this.type = "BlockStatement";
      this.body = body;
      var i = 0;
      for (var $__0 = body[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__1; !($__1 = $__0.next()).done; ) {
        var statement = $__1.value;
        {
          if (statement) {
            statement.parent = this;
          } else {
            body[i] = {type: "EmptyStatement"};
          }
          i++;
        }
      }
    }
    BlockStatement.prototype = Object.create(Node);
    BlockStatement.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      var i = 0;
      while (i < this.body.length) {
        var statement = this.body[i];
        if (!statement || !!statement.codeGenerated) {
          i++;
          continue;
        }
        if (typeof statement.codegen === "function" ? statement.codegen() : void 0) {
          this.body[this.body.indexOf(statement)] = statement;
          i++;
        } else {
          this.body.splice(i, 1);
        }
      }
      return this;
    };
    exports.BlockStatement = BlockStatement;
  }());
  return {};
});
System.get("BlockStatement" + '');
