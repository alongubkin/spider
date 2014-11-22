"use strict";
(function () {
    var Node = require("../Node").Node, CallExpression = require("./CallExpression").CallExpression;
    function NullCheckCallExpression(callee, args) {
        Node.call(this);
        this.type = "NullCheckCallExpression";
        this.callee = callee;
        this.callee.parent = this;
        this.args = args;
        args.every(function (arg) {
            arg.parent = this;
            return true;
        }, this);
    }
    NullCheckCallExpression.prototype = Object.create(Node);
    NullCheckCallExpression.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        var calleeType = this.callee.type;
        this.callee = this.callee.codegen();
        var args = this.args;
        args.every(function (arg, i) {
            var isSplat = args[i].type === "SplatExpression";
            args[i] = arg.codegen();
            args[i].codeGenerated = true;
            if (isSplat) {
                args[i].__splat = true;
            }
            return true;
        }, this);
        if (typeof this.callee.hasCallExpression === "function" ? this.callee.hasCallExpression() : void 0) {
            var context = this.getContext();
            var id = {
                "type": "Identifier",
                "name": NullCheckCallExpression.getNextVariableName(),
                "codeGenerated": true
            };
            context.node.body.splice(context.position + (NullCheckCallExpression.nullCheckIndex - 2), 0, {
                "type": "VariableDeclaration",
                "declarations": [{
                        "type": "VariableDeclarator",
                        "id": id,
                        "init": this.callee
                    }],
                "kind": "var",
                "codeGenerated": true
            });
            this.callee = id;
        }
        var test = {
            "type": "BinaryExpression",
            "operator": "===",
            "left": {
                "type": "UnaryExpression",
                "operator": "typeof",
                "argument": this.callee,
                "prefix": true
            },
            "right": {
                "type": "Literal",
                "value": "function",
                "raw": "\"function\""
            }
        };
        var argument = test.left.argument;
        if (calleeType === "NullPropagatingExpression") {
            argument = argument.consequent;
            test.left.argument = argument;
            test = {
                "type": "LogicalExpression",
                "operator": "&&",
                "left": this.callee.test,
                "right": test
            };
        }
        argument.codeGenerated = true;
        var consequent = new CallExpression(argument, args).codegen();
        if (this.parent.type === "ExpressionStatement") {
            this.parent.type = "IfStatement";
            this.parent.test = test;
            this.parent.consequent = {
                type: "BlockStatement",
                body: [{
                        type: "ExpressionStatement",
                        expression: consequent
                    }]
            };
            this.parent.alternate = null;
        } else {
            this.type = "ConditionalExpression";
            this.test = test;
            this.consequent = consequent;
            this.alternate = {
                "type": "UnaryExpression",
                "operator": "void",
                "argument": {
                    "type": "Literal",
                    "value": 0,
                    "raw": "0"
                },
                "prefix": true
            };
        }
        return this;
    };
    NullCheckCallExpression.prototype.hasCallExpression = function () {
        return true;
    };
    NullCheckCallExpression.getNextVariableName = function () {
        if (!(typeof this.nullCheckIndex !== "undefined" && this.nullCheckIndex !== null)) {
            this.nullCheckIndex = 0;
        }
        return "nullCheck" + this.nullCheckIndex++;
    };
    NullCheckCallExpression.resetVariableNames = function () {
        this.nullCheckIndex = 0;
    };
    exports.NullCheckCallExpression = NullCheckCallExpression;
}());

//# sourceMappingURL=lib/ast/expressions/NullCheckCallExpression.map