System.register("RangeMemberExpression", [], function() {
  "use strict";
  var __moduleName = "RangeMemberExpression";
  function require(path) {
    return $traceurRuntime.require("RangeMemberExpression", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function RangeMemberExpression(object, range) {
      Node.call(this);
      this.type = "RangeMemberExpression";
      this.object = object;
      this.object.parent = this;
      this.range = range;
      this.range.parent = this;
    }
    RangeMemberExpression.prototype = Object.create(Node);
    RangeMemberExpression.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      var isNumber = function(n) {
        return !isNaN(parseFloat(n)) && !!isFinite(n);
      };
      if (!!(this.parent.type === "AssignmentExpression") && !!(this.parent.left === this)) {
        this.parent.type = "CallExpression";
        this.parent.callee = {
          "type": "MemberExpression",
          "computed": false,
          "object": {
            "type": "MemberExpression",
            "computed": false,
            "object": {
              "type": "ArrayExpression",
              "elements": []
            },
            "property": {
              "type": "Identifier",
              "name": "splice"
            }
          },
          "property": {
            "type": "Identifier",
            "name": "apply"
          }
        };
        var to;
        var start = this.range.start ? this.range.start.codegen() : {
          "type": "Literal",
          "value": 0
        };
        if (typeof this.range.to !== "undefined" && this.range.to !== null) {
          if (!!isNumber(start.value) && !!isNumber(this.range.to.value)) {
            to = {
              "type": "Literal",
              "value": this.range.to.value - start.value + (this.range.operator === ".." ? 1 : 0)
            };
          } else {
            to = this.range.to.codegen();
            if (start.value !== 0) {
              to = {
                "type": "BinaryExpression",
                "operator": "-",
                "left": to,
                "right": start
              };
            }
            if (this.range.operator === "..") {
              to = {
                "type": "BinaryExpression",
                "operator": "+",
                "left": to,
                "right": {
                  "type": "Literal",
                  "value": 1
                }
              };
            }
          }
        } else {
          to = {
            "type": "Literal",
            "value": 9000000000,
            "raw": "9e9"
          };
        }
        Object.defineProperty(this.parent, "arguments", {
          value: [this.object.codegen(), {
            "type": "CallExpression",
            "callee": {
              "type": "MemberExpression",
              "computed": false,
              "object": {
                "type": "ArrayExpression",
                "elements": [start, to]
              },
              "property": {
                "type": "Identifier",
                "name": "concat"
              }
            },
            "arguments": [this.parent.right]
          }],
          enumerable: true
        });
      } else {
        this.type = "CallExpression";
        this.callee = {
          "type": "MemberExpression",
          "computed": false,
          "object": this.object.codegen(),
          "property": {
            "type": "Identifier",
            "name": "slice"
          }
        };
        var args = [];
        if (!(typeof this.range.start !== "undefined" && this.range.start !== null)) {
          args.push({
            "type": "Literal",
            "value": 0
          });
        } else {
          args.push(this.range.start.codegen());
        }
        if (typeof this.range.to !== "undefined" && this.range.to !== null) {
          if (this.range.operator === "...") {
            args.push(this.range.to.codegen());
          } else {
            if (!!this.range.to.value && !!isNumber(this.range.to.value)) {
              args.push({
                "type": "Literal",
                "value": this.range.to.value + 1
              });
            } else {
              args.push({
                "type": "BinaryExpression",
                "operator": "+",
                "left": this.range.to.codegen(),
                "right": {
                  "type": "Literal",
                  "value": 1
                }
              });
            }
          }
        }
        Object.defineProperty(this, "arguments", {
          value: args,
          enumerable: true
        });
      }
      return this;
    };
    RangeMemberExpression.prototype.hasCallExpression = function() {
      return true;
    };
    exports.RangeMemberExpression = RangeMemberExpression;
  }());
  return {};
});
System.get("RangeMemberExpression" + '');
