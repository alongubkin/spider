var Node = require('../Node').Node;

exports.RangeMemberExpression = function (object, range) {
  Node.call(this);
  
  this.type = 'RangeMemberExpression';
  this.object = object;
  this.object.parent = this;
  
  this.range = range;
  this.range.parent = this;
};

exports.RangeMemberExpression.prototype = Object.create(Node);

exports.RangeMemberExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  var isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };
   
  // If this node is the left side of an assignment expression,  
  // it means we're dealing with splice. For example: 
  // items[1..2] = [1, 2];
  if (this.parent.type === 'AssignmentExpression' &&
      this.parent.left === this) {
    this.parent.type = 'CallExpression';

    this.parent.callee = {
      "type": "MemberExpression",
      "computed": false,
      "object": {
        "type": "MemberExpression",
        "computed": false,
        "object": {
          "type": "ArrayExpression",
          "elements": []
        },
        "property": {
          "type": "Identifier",
          "name": "splice"
        }
      },
      "property": {
        "type": "Identifier",
        "name": "apply"
      }
    };
    
    var to;
    var from = this.range.from ? 
               this.range.from.codegen() : {
                 "type": "Literal",
                 "value": 0
               };   
    
    if (this.range.to) {
      if (isNumber(from.value) &&
          isNumber(this.range.to.value)) {        
        to = {
          "type": "Literal",
          "value": this.range.to.value - from.value + (this.range.operator === '..' ? 1 : 0)
        };
      } else {
        to = this.range.to.codegen();
        if (from.value !== 0) {
          to = {
            "type": "BinaryExpression",
            "operator": "-",
            "left": to,
            "right": from,
          };
        }
        
        if (this.range.operator === '..') {
          to = {
            "type": "BinaryExpression",
            "operator": "+",
            "left": to,
            "right": {
              "type": "Literal",
              "value": 1
            }
          };
        }
      }          
    } else {
      to = {
        "type": "Literal",
        "value": 9000000000,
        "raw": "9e9"
      };
    }  
  
    Object.defineProperty(this.parent, 'arguments', { 
      value: [
        this.object.codegen(),
        {
          "type": "CallExpression",
          "callee": {
            "type": "MemberExpression",
            "computed": false,
            "object": {
              "type": "ArrayExpression",
              "elements": [from, to]
            },
            "property": {
              "type": "Identifier",
              "name": "concat"
            }
          },
          "arguments": [
            this.parent.right
          ]
        }
      ], 
      enumerable: true 
    });
  } else {
    // Otherwise, we're dealing with slice. For example:
    // var x = items[1..2];
    this.type = "CallExpression";
    this.callee = {
      "type": "MemberExpression",
      "computed": false,
      "object": this.object.codegen(),
      "property": {
        "type": "Identifier",
        "name": "slice"
      }
    };
    
    var args = [];
    
    if (!this.range.from) {
      args.push({
        "type": "Literal",
        "value": 0
      });
    } else {
      args.push(this.range.from.codegen());
    }
    
    if (this.range.to) {
      if (this.range.operator === '...') {
        args.push(this.range.to.codegen());
      } else {
        if (this.range.to.value && isNumber(this.range.to.value)) {
          args.push({
            "type": "Literal",
            "value": this.range.to.value + 1
          });
        } else {
          args.push({
            "type": "BinaryExpression",
            "operator": "+",
            "left": this.range.to.codegen(),
            "right": {
              "type": "Literal",
              "value": 1
            }          
          });
        }
      }
    }
    
    Object.defineProperty(this, 'arguments', { 
      value: args, 
      enumerable: true 
    });
  }
  
  return this;
};

exports.RangeMemberExpression.prototype.hasCallExpression = function () {
  return true;
};