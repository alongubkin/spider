"use strict";
(function () {
    var Node = require("../Node").Node, Parameter = require("../Parameter").Parameter, CallExpression = require("../expressions/CallExpression").CallExpression;
    function FunctionExpression(id, params, body, inheritsFrom, operator) {
        Node.call(this);
        this.type = "FunctionExpression";
        this.defaults = [];
        this.rest = null;
        this.generator = false;
        this.expression = false;
        this.operator = operator;
        this.id = id;
        if (typeof this.id !== "undefined" && this.id !== null) {
            this.id.parent = this;
        }
        this.body = body;
        this.params = params;
        body.parent = this;
        params.forEach(function (param) {
            param.parent = this;
        }, this);
        this.inheritsFrom = inheritsFrom;
        if (typeof this.inheritsFrom !== "undefined" && this.inheritsFrom !== null) {
            this.inheritsFrom.parent = this;
        }
        if (this.body.type !== "BlockStatement") {
            this.autoBlock = true;
            this.body = {
                "type": "BlockStatement",
                "body": [{
                        "type": "ReturnStatement",
                        "argument": this.body
                    }]
            };
            var self = this;
            this.getContext = function () {
                return {
                    node: self.body,
                    position: -1
                };
            };
        }
    }
    FunctionExpression.prototype = Object.create(Node);
    FunctionExpression.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        if (typeof this.id !== "undefined" && this.id !== null) {
            this.id = this.id.codegen(false);
        }
        Parameter.generateFunctionBody(this, this.params, this.body);
        if (this.autoBlock) {
            this.body.body[0].argument = this.body.body[this.body.body.length - 1].argument.codegen();
        } else {
            this.body = this.body.codegen();
        }
        if (this.operator === "=>") {
            var parent = this.parent;
            while (!!(!!(typeof parent !== "undefined" && parent !== null) && !!(parent.type !== "FunctionExpression")) && !parent.__fatArrow) {
                parent = parent.parent;
            }
            if (!(typeof parent !== "undefined" && parent !== null)) {
                this.type = "CallExpression";
                this.callee = {
                    "type": "FunctionExpression",
                    "id": null,
                    "params": [{
                            "type": "Identifier",
                            "name": "_this"
                        }],
                    "defaults": [],
                    "body": {
                        "type": "BlockStatement",
                        "body": [{
                                "type": "ReturnStatement",
                                "argument": {
                                    "type": "FunctionExpression",
                                    "id": null,
                                    "params": [],
                                    "defaults": [],
                                    "body": this.body,
                                    "rest": null,
                                    "generator": false,
                                    "expression": false
                                },
                                "rest": null,
                                "generator": false,
                                "expression": false
                            }]
                    },
                    "__fatArrow": true
                };
                Object.defineProperty(this, "arguments", {
                    value: [{ "type": "ThisExpression" }],
                    enumerable: true
                });
            }
        }
        if (typeof this.inheritsFrom !== "undefined" && this.inheritsFrom !== null) {
            if (this.inheritsFrom.type !== "CallExpression") {
                this.inheritsFrom = new CallExpression(this.inheritsFrom, []);
                this.inheritsFrom.parent = this;
            }
            var context = this.getContext();
            this.body.body.splice(0, 0, {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": this.inheritsFrom.callee,
                        "property": {
                            "type": "Identifier",
                            "name": "call"
                        }
                    },
                    "arguments": [{ "type": "ThisExpression" }].concat(this.inheritsFrom.arguments)
                }
            });
            var id = {
                "type": "Identifier",
                "name": FunctionExpression.getNextVariableName()
            };
            context.node.body.splice(context.position, 0, {
                "type": "VariableDeclaration",
                "declarations": [{
                        "type": "VariableDeclarator",
                        "id": id,
                        "init": this
                    }],
                "kind": "var",
                "codeGenerated": true
            });
            context.node.body.splice(context.position + 1, 0, {
                "type": "ExpressionStatement",
                "codeGenerated": "true",
                "expression": {
                    "type": "AssignmentExpression",
                    "operator": "=",
                    "left": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": id,
                        "property": {
                            "type": "Identifier",
                            "name": "prototype"
                        }
                    },
                    "right": {
                        "type": "CallExpression",
                        "callee": {
                            "type": "MemberExpression",
                            "computed": false,
                            "object": {
                                "type": "Identifier",
                                "name": "Object"
                            },
                            "property": {
                                "type": "Identifier",
                                "name": "create"
                            }
                        },
                        "arguments": [this.inheritsFrom.callee]
                    }
                }
            });
            return id;
        }
        return this;
    };
    FunctionExpression.prototype.hasCallExpression = function () {
        return true;
    };
    FunctionExpression.getNextVariableName = function () {
        if (!(typeof this.functionExpressionIndex !== "undefined" && this.functionExpressionIndex !== null)) {
            this.functionExpressionIndex = 0;
        }
        return "functionExpression" + this.functionExpressionIndex++;
    };
    FunctionExpression.resetVariableNames = function () {
        this.functionExpressionIndex = 0;
    };
    exports.FunctionExpression = FunctionExpression;
}());

//# sourceMappingURL=lib/ast/expressions/FunctionExpression.map