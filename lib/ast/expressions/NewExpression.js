"use strict";
(function () {
    var Node = require("../Node").Node;
    function NewExpression(callee, args) {
        Node.call(this);
        this.type = "NewExpression";
        this.callee = callee;
        this.callee.parent = this;
        Object.defineProperty(this, "arguments", {
            value: args,
            enumerable: true
        });
        args.every(function (arg) {
            arg.parent = this;
            return true;
        }, this);
    }
    NewExpression.prototype = Object.create(Node);
    NewExpression.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        this.callee = this.callee.codegen();
        var args = this.arguments;
        args.every(function (arg, i) {
            args[i] = arg.codegen();
            return true;
        }, this);
        return this;
    };
    NewExpression.prototype.hasCallExpression = function () {
        return true;
    };
    exports.NewExpression = NewExpression;
}());

//# sourceMappingURL=lib/ast/expressions/NewExpression.map