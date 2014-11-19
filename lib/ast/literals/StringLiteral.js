var Node = require('../Node').Node;

exports.StringLiteral = function (chars) {
  Node.call(this);
  
  this.type = 'StringLiteral';
  this.chars = chars;
};

exports.StringLiteral.prototype = Object.create(Node);

exports.StringLiteral.prototype.codegen = function () {
  var self = this;
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  var elements = [];
  
  this.chars.forEach(function (value) { 
    if (typeof value === 'string') {
      var lastElement = elements[elements.length - 1];
      if (lastElement && lastElement.type === 'Literal') {
        lastElement.value += value;
      } else {
        elements.push({
          type: 'Literal',
          value: value
        });
      }
    } else{
      value.parent = self;
      elements.push(value.codegen());
    }
  });
  
  if (elements.length === 1) {
    return elements[0];
  }
  
  var reduced = elements.reduce(function (left, right) {
    return {
      type: 'BinaryExpression',
      operator: '+',
      left: left,
      right: right
    };
  });
    
  this.type = reduced.type;
  this.operator = reduced.operator;
  this.left = reduced.left;
  this.right = reduced.right;
  
  return this;
};

exports.StringLiteral.prototype.hasCallExpression = function () {
  return false;
};