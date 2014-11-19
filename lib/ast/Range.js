var Node = require('./Node').Node;

exports.Range = function (from, operator, to) {
  Node.call(this);
  
  this.type = 'Range';
  this.operator = operator;
  
  this.from = from;
  
  if (this.from) {
    this.from.parent = this;
  }
  
  this.to = to;
  
  if (this.to) {
    this.to.parent = this;
  }
};

exports.Range.prototype = Object.create(Node);

exports.Range.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  var isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  var isNumeric = isNumber(this.from.value) && isNumber(this.to.value);
                  
  this.from = this.from.codegen();
  this.to = this.to.codegen();
  
  var updateOperator, testOperator;
  
  if (isNumeric) {
    updateOperator = this.from.value < this.to.value ? '++' : '--';
    testOperator = this.from.value < this.to.value ? '<' : '>';
    
    if (this.operator === '..') {
      testOperator += '=';
    }
  }
  
  if (isNumeric && Math.abs(this.to.value - this.from.value) <= 20) {
    this.type = 'ArrayExpression';
    this.elements = [];
    
    var test = function (i) {
      switch (testOperator) {
      case '>':
        return i > this.to.value;
      
      case '<':
        return i < this.to.value;
      
      case '>=':
        return i >= this.to.value;
      
      case '<=':
        return i <= this.to.value;
      }
    };
    
    for (var i = this.from.value; 
        test.call(this, i);
        (updateOperator === '++') ? i++ : i--) {
      this.elements.push({ 
        "type": "Literal",
        "value": i
      });
    }
  } else {
    var testExpression, updateExpression;
    
    var declarations = [{
      "type": "VariableDeclarator",
      "id": {
        "type": "Identifier",
        "name": "_results"
      },
      "init": {
        "type": "ArrayExpression",
        "elements": []
      }
    }];
    
    if (isNumeric) {
      testExpression = {
        "type": "BinaryExpression",
        "operator": testOperator,
        "left": {
          "type": "Identifier",
          "name": "_i"
        },
        "right": this.to
      };
      
      updateExpression = {
        "type": "UpdateExpression",
        "operator": updateOperator,
        "argument": {
          "type": "Identifier",
          "name": "_i"
        },
        "prefix": false
      };
    } else {
      if (this.from.hasCallExpression()) {
        var startId = {
          "type": "Identifier",
          "name": "_start"
        };
          
        declarations.push({
          "type": "VariableDeclarator",
          "id": startId,
          "init": this.from
        });
        
        this.from = startId;
      }
      
      if (this.to.hasCallExpression()) {
        var endId = {
          "type": "Identifier",
          "name": "_end"
        };
          
        declarations.push({
          "type": "VariableDeclarator",
          "id": endId,
          "init": this.to
        });
        
        this.to = endId;
      }    
      
      testExpression = {
        "type": "ConditionalExpression",
        "test": {
          "type": "BinaryExpression",
          "operator": "<=",
          "left": this.from,
          "right": this.to
        },
        "consequent": {
          "type": "BinaryExpression",
          "operator": "<" + (this.operator === '..' ? '=' : ''),
          "left": {
            "type": "Identifier",
            "name": "_i"
          },
          "right": this.to
        },
        "alternate": {
          "type": "BinaryExpression",
          "operator": ">" + (this.operator === '..' ? '=' : ''),
          "left": {
            "type": "Identifier",
            "name": "_i"
          },
          "right": this.to
        } 
      };
      
      updateExpression = {
        "type": "ConditionalExpression",
        "test":  {
          "type": "BinaryExpression",
          "operator": "<=",
          "left": this.from,
          "right": this.to
        },
        "consequent": {
          "type": "UpdateExpression",
          "operator": "++",
          "argument": {
            "type": "Identifier",
            "name": "_i"
          },
          "prefix": false
        },
        "alternate": {
          "type": "UpdateExpression",
          "operator": "--",
          "argument": {
            "type": "Identifier",
            "name": "_i"
          },
          "prefix": false
        }
      };
    }
    
    this.type = 'CallExpression';
    
    this.callee = {
      "type": "MemberExpression",
      "computed": false,
      "object": {
        "type": "FunctionExpression",
        "id": null,
        "params": [],
        "defaults": [],
        "body": {
          "type": "BlockStatement",
          "body": [
            {
              "type": "VariableDeclaration",
              "declarations": declarations,
              "kind": "var"
            },
            {
              "type": "ForStatement",
              "init": {
                "type": "VariableDeclaration",
                "declarations": [{
                  "type": "VariableDeclarator",
                  "id": {
                    "type": "Identifier",
                    "name": "_i"
                  },
                  "init": this.from
                }],
                "kind": "var"
              },
              "test": testExpression,
              "update": updateExpression,
              "body": {
                "type": "BlockStatement",
                "body": [{
                  "type": "ExpressionStatement",
                  "expression": {
                    "type": "CallExpression",
                    "callee": {
                      "type": "MemberExpression",
                      "computed": false,
                      "object": {
                        "type": "Identifier",
                        "name": "_results"
                      },
                      "property": {
                        "type": "Identifier",
                        "name": "push"
                      }
                    },
                    "arguments": [{
                      "type": "Identifier",
                      "name": "_i"
                    }]
                  }
                }]
              }
            },
            {
              "type": "ReturnStatement",
              "argument": {
                "type": "Identifier",
                "name": "_results"
              }
            }
          ]
        },
        "rest": null,
        "generator": false,
        "expression": false
      },
      "property": {
        "type": "Identifier",
        "name": "apply"
      }
    };
  
    Object.defineProperty(this, 'arguments', { 
      value: [{ "type": "ThisExpression" }], 
      enumerable: true 
    });    
  }
  
  return this;
};

exports.Range.prototype.hasCallExpression = function () {
  return true;
};