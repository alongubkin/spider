System.register("ast", [], function() {
  "use strict";
  var __moduleName = "ast";
  function require(path) {
    return $traceurRuntime.require("ast", path);
  }
  "use strict";
  (function() {
    var nodes = ["Node", "Program", "VariableDeclarator", "Property", "Range", "Parameter", "CatchClause", "CaseClause", "ImportSpecifier", "ImportNamespaceSpecifier", "ImportDefaultSpecifier", "ExportSpecifier", "ExportBatchSpecifier", "expressions/AssignmentExpression", "expressions/BinaryExpression", "expressions/CallExpression", "expressions/ExistentialExpression", "expressions/LogicalExpression", "expressions/MemberExpression", "expressions/NullCheckCallExpression", "expressions/NullCoalescingExpression", "expressions/NullPropagatingExpression", "expressions/UnaryExpression", "expressions/ObjectExpression", "expressions/ArrayExpression", "expressions/ObjectPattern", "expressions/ArrayPattern", "expressions/UpdateExpression", "expressions/FunctionExpression", "expressions/RangeMemberExpression", "expressions/NewExpression", "expressions/ThisExpression", "expressions/SuperExpression", "expressions/SplatExpression", "expressions/ConditionalExpression", "expressions/InExpression", "expressions/ForInExpression", "expressions/CurryCallExpression", "statements/BlockStatement", "statements/ExpressionStatement", "statements/IfStatement", "statements/ForStatement", "statements/ForInStatement", "statements/ForOfStatement", "statements/WhileStatement", "statements/UntilStatement", "statements/VariableDeclarationStatement", "statements/FunctionDeclarationStatement", "statements/ReturnStatement", "statements/ThrowStatement", "statements/BreakStatement", "statements/ContinueStatement", "statements/DebuggerStatement", "statements/UseStatement", "statements/TryStatement", "statements/SwitchStatement", "statements/FallthroughStatement", "statements/ImportDeclarationStatement", "statements/ExportDeclarationStatement", "statements/DoWhileStatement", "statements/PushStatement", "statements/GoStatement", "literals/BooleanLiteral", "literals/NumberLiteral", "literals/StringLiteral", "literals/NullLiteral", "literals/UndefinedLiteral", "literals/Identifier", "literals/RegularExpressionLiteral"];
    module.exports = {};
    for (var $__0 = nodes[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__1; !($__1 = $__0.next()).done; ) {
      var node = $__1.value;
      {
        var name = node.substring(node.lastIndexOf("/") + 1);
        module.exports[name] = module.require("./ast/" + node)[name];
      }
    }
  }());
  return {};
});
System.get("ast" + '');
