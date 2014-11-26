System.register("CaseClause", [], function() {
  "use strict";
  var __moduleName = "CaseClause";
  function require(path) {
    return $traceurRuntime.require("CaseClause", path);
  }
  "use strict";
  (function() {
    var Node = module.require("./Node").Node;
    function CaseClause(tests, body) {
      Node.call(this);
      this.type = "CaseClause";
      this.body = body;
      this.body.parent = this;
      this.tests = tests;
      if (typeof this.tests !== "undefined" && this.tests !== null) {
        for (var $__0 = this.tests[$traceurRuntime.toProperty(Symbol.iterator)](),
            $__1; !($__1 = $__0.next()).done; ) {
          var test = $__1.value;
          {
            test.parent = this;
          }
        }
      }
    }
    CaseClause.prototype = Object.create(Node);
    CaseClause.prototype.codegen = function(branchFallthrough) {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      if (!(typeof this.tests !== "undefined" && this.tests !== null) && !branchFallthrough) {
        return this.body.codegen();
      }
      this.type = "IfStatement";
      this.switchCase = true;
      var rangeError = false;
      if (typeof this.tests !== "undefined" && this.tests !== null) {
        for (var $__2 = this.tests[$traceurRuntime.toProperty(Symbol.iterator)](),
            $__3; !($__3 = $__2.next()).done; ) {
          var test = $__3.value;
          {
            var equalsToDiscriminant;
            if (test.type === "Range") {
              var fromCheck;
              if (test.start) {
                fromCheck = {
                  "type": "BinaryExpression",
                  "operator": ">=",
                  "left": this.parent.discriminant,
                  "right": test.start
                };
              }
              var toCheck;
              if (test.to) {
                toCheck = {
                  "type": "BinaryExpression",
                  "operator": "<" + (test.operator === ".." ? "=" : ""),
                  "left": this.parent.discriminant,
                  "right": test.to
                };
              }
              if (!!fromCheck && !!toCheck) {
                equalsToDiscriminant = {
                  "type": "LogicalExpression",
                  "operator": "&&",
                  "left": fromCheck,
                  "right": toCheck
                };
              } else {
                if (!!fromCheck || !!toCheck) {
                  equalsToDiscriminant = typeof fromCheck === "undefined" || fromCheck == null ? toCheck : fromCheck;
                } else {
                  rangeError = test;
                  break;
                }
              }
            } else {
              if (test.type === "ArrayExpression") {
                test = test.codegen();
                equalsToDiscriminant = {
                  "type": "BinaryExpression",
                  "operator": ">=",
                  "left": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": this.parent.discriminant,
                    "property": {
                      "type": "Identifier",
                      "name": "length"
                    }
                  },
                  "right": {
                    "type": "Literal",
                    "value": test.elements.length
                  }
                };
                var i = 0;
                for (var $__0 = test.elements[$traceurRuntime.toProperty(Symbol.iterator)](),
                    $__1; !($__1 = $__0.next()).done; ) {
                  var element = $__1.value;
                  {
                    if (typeof element !== "undefined" && element !== null) {
                      equalsToDiscriminant = {
                        "type": "LogicalExpression",
                        "operator": "&&",
                        "left": equalsToDiscriminant,
                        "right": {
                          "type": "BinaryExpression",
                          "operator": "===",
                          "left": {
                            "type": "MemberExpression",
                            "computed": true,
                            "object": this.parent.discriminant,
                            "property": {
                              "type": "Literal",
                              "value": i
                            }
                          },
                          "right": element
                        }
                      };
                    }
                    i++;
                  }
                }
              } else {
                equalsToDiscriminant = {
                  "type": "BinaryExpression",
                  "operator": "===",
                  "left": this.parent.discriminant,
                  "right": test.codegen()
                };
              }
            }
            if (!this.test) {
              this.test = equalsToDiscriminant;
            } else {
              this.test = {
                "type": "LogicalExpression",
                "operator": "||",
                "left": this.test,
                "right": equalsToDiscriminant
              };
            }
          }
        }
      }
      if (rangeError) {
        Node.getErrorManager().error({
          type: "EmptyRange",
          message: "empty range in case clause is disallowed.",
          loc: rangeError.loc
        });
        return null;
      }
      this.consequent = this.body.codegen();
      if (branchFallthrough) {
        var fallthroughTest = {
          "type": "BinaryExpression",
          "left": this.parent.fallthroughId,
          "operator": "<",
          "right": {
            "type": "Literal",
            "value": 2
          }
        };
        if (!(typeof this.tests !== "undefined" && this.tests !== null)) {
          this.test = fallthroughTest;
        } else {
          this.test = {
            "type": "LogicalExpression",
            "operator": "&&",
            "left": fallthroughTest,
            "right": this.test
          };
        }
      }
      this.alternate = null;
      return this;
    };
    exports.CaseClause = CaseClause;
  }());
  return {};
});
System.get("CaseClause" + '');
