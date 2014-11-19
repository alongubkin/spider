"use strict;";
(function () {
    var nodes = [
        "Node",
        "Program",
        "VariableDeclarator",
        "Property",
        "Range",
        "Parameter",
        "CatchClause",
        "CaseClause",
        "expressions/AssignmentExpression",
        "expressions/BinaryExpression",
        "expressions/CallExpression",
        "expressions/ExistentialExpression",
        "expressions/LogicalExpression",
        "expressions/MemberExpression",
        "expressions/NullCheckCallExpression",
        "expressions/NullCoalescingExpression",
        "expressions/NullPropagatingExpression",
        "expressions/UnaryExpression",
        "expressions/ObjectExpression",
        "expressions/ArrayExpression",
        "expressions/UpdateExpression",
        "expressions/FunctionExpression",
        "expressions/RangeMemberExpression",
        "expressions/NewExpression",
        "expressions/ThisExpression",
        "expressions/SuperExpression",
        "expressions/SplatExpression",
        "expressions/ConditionalExpression",
        "expressions/InExpression",
        "expressions/ForInExpression",
        "statements/BlockStatement",
        "statements/ExpressionStatement",
        "statements/IfStatement",
        "statements/ForStatement",
        "statements/ForInStatement",
        "statements/ForOfStatement",
        "statements/WhileStatement",
        "statements/UntilStatement",
        "statements/VariableDeclarationStatement",
        "statements/FunctionDeclarationStatement",
        "statements/ReturnStatement",
        "statements/ThrowStatement",
        "statements/BreakStatement",
        "statements/ContinueStatement",
        "statements/DebuggerStatement",
        "statements/UseStatement",
        "statements/TryStatement",
        "statements/SwitchStatement",
        "literals/BooleanLiteral",
        "literals/NumberLiteral",
        "literals/StringLiteral",
        "literals/NullLiteral",
        "literals/Identifier"
    ];
    module.exports = {};
    nodes.forEach(function (node) {
        var name = node.substring(node.lastIndexOf("/") + 1);
        module.exports[name] = require("./ast/" + node)[name];
    }, this);
}());

//# sourceMappingURL=lib/ast.map