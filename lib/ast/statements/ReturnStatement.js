"use strict";
(function () {
    var Node = require("../Node").Node;
    function ReturnStatement(argument) {
        Node.call(this);
        this.type = "ReturnStatement";
        this.argument = argument;
        if (typeof this.argument !== "undefined" && this.argument !== null) {
            this.argument.parent = this;
        }
    }
    ReturnStatement.prototype = Object.create(Node);
    ReturnStatement.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        if (typeof this.argument !== "undefined" && this.argument !== null) {
            this.argument = this.argument.codegen();
        }
        var parent = this.parent;
        while (!!(!!(typeof parent !== "undefined" && parent !== null) && !!(parent.type !== "ForInStatement")) && !!(parent.type !== "ForOfStatement")) {
            parent = parent.parent;
        }
        if (typeof parent !== "undefined" && parent !== null) {
            var context = this.getContext();
            var forContext = parent.getContext();
            if (!(typeof ReturnStatement.returnValueIndex !== "undefined" && ReturnStatement.returnValueIndex !== null)) {
                ReturnStatement.returnValueIndex = 0;
            }
            var returnIndex = ReturnStatement.returnValueIndex++;
            var returnedId = {
                "type": "Identifier",
                "name": "returned" + returnIndex
            };
            var returnValueId = {
                "type": "Identifier",
                "name": "returnValue" + returnIndex
            };
            forContext.node.body.splice(forContext.position, 0, {
                "type": "VariableDeclaration",
                "codeGenerated": true,
                "declarations": [
                    {
                        "type": "VariableDeclarator",
                        "id": returnedId,
                        "init": {
                            "type": "Literal",
                            "value": false
                        }
                    },
                    {
                        "type": "VariableDeclarator",
                        "id": returnValueId,
                        "init": null
                    }
                ],
                "kind": "var"
            });
            context.node.body.splice(context.position, 0, {
                "type": "ExpressionStatement",
                "codeGenerated": true,
                "expression": {
                    "type": "AssignmentExpression",
                    "operator": "=",
                    "left": returnedId,
                    "right": {
                        "type": "Literal",
                        "value": true
                    }
                }
            });
            if (typeof this.argument !== "undefined" && this.argument !== null) {
                context.node.body.splice(context.position + 1, 0, {
                    "type": "ExpressionStatement",
                    "codeGenerated": true,
                    "expression": {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": returnValueId,
                        "right": this.argument
                    }
                });
            }
            this.type = "ReturnStatement";
            this.argument = {
                "type": "Literal",
                "value": false
            };
            if (!(typeof parent.returnValueIfStatement !== "undefined" && parent.returnValueIfStatement !== null)) {
                forContext.node.body.splice(forContext.position + 2, 0, {
                    "type": "IfStatement",
                    "codeGenerated": true,
                    "test": returnedId,
                    "consequent": {
                        "type": "BlockStatement",
                        "body": [{
                                "type": "ReturnStatement",
                                "argument": returnValueId
                            }]
                    },
                    "alternate": null
                });
                parent.returnValueIfStatement = true;
            }
        }
        return this;
    };
    ReturnStatement.resetVariableNames = function () {
        this.returnValueIndex = 0;
    };
    exports.ReturnStatement = ReturnStatement;
}());

//# sourceMappingURL=lib/ast/statements/ReturnStatement.map