var Node = require('../Node').Node;
    
exports.CallExpression = function (callee, args) {
  var self = this;
  Node.call(self);
  
  self.type = 'CallExpression';
  self.callee = callee;
  self.callee.parent = self;
  
  Object.defineProperty(self, 'arguments', { 
    value: args, 
    enumerable: true 
  });
  
  args.forEach(function (arg) {
    arg.parent = self;
  });
};

exports.CallExpression.prototype = Object.create(Node);

exports.CallExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  var calleeType = this.callee.type;  
  
  if (!this.callee.codeGenerated) {
    this.callee = this.callee.codegen();
  }
  
  var args = this.arguments;
  var splatPositions = [];
  
  args.forEach(function (arg, i) {    
    if (args[i].type === "SplatExpression" || args[i].__splat) { 
      splatPositions.push(i);
    }
    
    if (!args[i].codeGenerated) { 
      args[i] = arg.codegen();
    }
  });
  
  if (splatPositions.length > 0) {
    var argsClone = args.slice(0);
    args.length = 0;
    args.push({ 
      "type": "Literal", 
      "value": null
    });
    
    if (argsClone.length === 1) {
      args.push(argsClone[0].arguments[0]);
    } else {
      args.push({ 
        "type": "CallExpression",
        "callee": {
          "type": "MemberExpression",
          "computed": false,
          "object": splatPositions[0] === 0 ? argsClone[0] : {
            "type": "ArrayExpression",
            "elements": argsClone.slice(0, splatPositions[0])
          },
          "property": {
            "type": "Identifier",
            "name": "concat"
          }
        },
        "arguments": argsClone.slice(splatPositions[0] === 0 ? 1 : splatPositions[0])
          .map(function (arg, i) {
            if (splatPositions.indexOf(i + (splatPositions[0] === 0 ? 1 : splatPositions[0])) !== -1) {
              return arg;
            }
            
            return {
              "type": "ArrayExpression",
              "elements": [arg]
            };
          })
      });
    }
  }
  
  // If we are null propagating (?.), then turn this 
  // into a condition and add the null propagating condition.
  if (this.callee.type === 'ConditionalExpression' && 
      (calleeType === 'NullPropagatingExpression' || calleeType === 'MemberExpression')) {
    var parent = this.parent;
    
    var consequent = {
      type: 'CallExpression',
      callee: this.callee.consequent,
      arguments: this.arguments
    };
    
    if (splatPositions.length > 0) {
      this.callee.consequent = {
        "type": "MemberExpression",
        "computed": false,
        "object": this.callee.consequent,
        "property": {
          "type": "Identifier",
          "name": "apply"
        }
      };
    }
                
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
            expression: consequent
          }
        ]
      };
      parent.alternate = null;
    } else {
      // Otherwise, it should be a conditional expression (?:).
      this.type = 'ConditionalExpression';
      this.test = this.callee.test;
      this.consequent = consequent;
      this.alternate = this.callee.alternate;
    }
  } else if (splatPositions.length > 0) {
    this.callee = {
      "type": "MemberExpression",
      "computed": false,
      "object": this.callee,
      "property": {
        "type": "Identifier",
        "name": "apply"
      }
    };
  }
  
  return this;
};

exports.CallExpression.prototype.hasCallExpression = function () {
  return true;
};