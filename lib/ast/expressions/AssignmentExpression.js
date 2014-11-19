"use strict";
(function () {
    var Node = require("../Node").Node;
    function AssignmentExpression(left, operator, right) {
        Node.call(this);
        this.type = "AssignmentExpression";
        this.operator = operator;
        this.left = left;
        this.left.parent = this;
        this.right = right;
        this.right.parent = this;
    }
    AssignmentExpression.prototype = Object.create(Node);
    AssignmentExpression.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        this.left = this.left.codegen();
        this.right = this.right.codegen();
        return this;
    };
    AssignmentExpression.prototype.hasCallExpression = function () {
        return !!(!!(this.left !== null) && !!this.left.hasCallExpression()) || !!(!!(this.right !== null) && !!this.right.hasCallExpression());
    };
    exports.AssignmentExpression = AssignmentExpression;
}());

//# sourceMappingURL=lib/ast/expressions/AssignmentExpression.map