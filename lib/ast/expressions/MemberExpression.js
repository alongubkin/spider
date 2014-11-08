var Node = require('../Node').Node;

exports.MemberExpression = function (left, right, computed) {
  Node.call(this);

  this.type = 'MemberExpression';
  this.computed = computed;
  
  this.object = left;
  this.object.parent = this;
  
  this.property = right;
  this.property.parent = this;
};

exports.MemberExpression.prototype = Object.create(Node);

exports.MemberExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  var objectType = this.object.type;

  this.object = this.object.codegen(); 
    
  if (!this.property.codeGenerated) {
    this.property = this.property.codegen(false);
  }
  
  // compile an expression such as: b?.c?.d.e
  // to: typeof b !== "undefined" && (b !== null && b.c !== null) ? b.c.d.e : null
  // instead of: (typeof b !== "undefined" && (b !== null && b.c !== null) ? b.c.d : null).e;
  if (this.object.type === 'ConditionalExpression' &&
      (objectType === 'NullPropagatingExpression' || objectType === 'MemberExpression' || 
       objectType === 'CallExpression' || objectType === 'NullCheckCallExpression')) {
    this.type = this.object.type;
    this.test = this.object.test;
    this.alternate = this.object.alternate;
    
    this.consequent = {
      type: 'MemberExpression',
      object: this.object.consequent,
      property: this.property,
      computed: this.computed
    };
  }
  
  return this;
};

exports.MemberExpression.prototype.hasCallExpression = function () {
  return this.object.__null_propagating ||
         (this.object !== null && this.object.hasCallExpression && this.object.hasCallExpression()) ||
         (this.property !== null && this.property.hasCallExpression());
};