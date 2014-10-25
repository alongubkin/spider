var Node = require('../Node').Node;
    
exports.CallExpression = function (callee) {
  Node.call(this);
  
  this.type = 'CallExpression';
  this.callee = callee;
  this.callee.parent = this;
  
  Object.defineProperty(this, 'arguments', { 
    value: [], 
    enumerable: true 
  });
};

exports.CallExpression.prototype = Object.create(Node);

exports.CallExpression.prototype.codegen = function () {
  var calleeType = this.callee.type;  
  this.callee = this.callee.codegen();
  
  // If we are null propagating (?.), then turn this 
  // into a condition and add the null propagating condition.
  if (this.callee.type === 'ConditionalExpression' && 
      (calleeType === 'NullPropagatingExpression' || calleeType === 'MemberExpression')) {
    var parent = this.parent;
    
    // If we're inside a statement, then turn this into
    // a normal if statement.
    if (parent.type === 'ExpressionStatement') {
      parent.type = 'IfStatement';
      parent.test = this.callee.test;
      parent.consequent = {
        type: 'BlockStatement',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: this.callee.consequent,
              arguments: this.arguments
            }
          }
        ]
      };
      parent.alternate = null;
    } else {
      // Otherwise, it should be a conditional expression (?:).
      this.type =  'ConditionalExpression';
      this.test = this.callee.test;
      this.consequent = {
        type: 'CallExpression',
        callee: this.callee.consequent,
        arguments: this.arguments
      };
      this.alternate = this.callee.alternate;
    }
  }
  
  return this;
};

exports.CallExpression.prototype.hasCallExpression = function () {
  return true;
};