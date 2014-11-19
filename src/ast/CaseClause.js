var Node = require('./Node').Node;

exports.CaseClause = function (tests, body) {
  var self = this;
  Node.call(this);
  
  self.type = 'CaseClause';
  
  self.tests = tests;
  if (self.tests) {
    self.tests.forEach(function (test) {
      test.parent = self;
    });
  }
  
  self.body = body;
  self.body.parent = self;
};

exports.CaseClause.prototype = Object.create(Node);

exports.CaseClause.prototype.codegen = function () {
  var self = this;
  
  if (!Node.prototype.codegen.call(self)) {
    return;
  }
  
  if (!self.tests) {
    return self.body.codegen();
  }
  
  self.type = "IfStatement";
  
  var rangeError = false;
  self.tests.forEach(function (test) {
    var equalsToDiscriminant;
  
    if (test.type === "Range") {
      var fromCheck;
      if (test.from) {
        fromCheck = {
          "type": "BinaryExpression",
          "operator": ">=",
          "left": self.parent.discriminant,
          "right": test.from
        };
      }
      
      var toCheck;
      if (test.to) {
        toCheck = {
          "type": "BinaryExpression",
          "operator": "<" + (test.operator === ".." ? "=": ""),
          "left": self.parent.discriminant,
          "right": test.to
        };
      }
      
      if (fromCheck && toCheck) {
        equalsToDiscriminant = {
          "type": "LogicalExpression",
          "operator": "&&",
          "left": fromCheck,
          "right": toCheck
        };
      } else if (fromCheck || toCheck) {
        equalsToDiscriminant = fromCheck || toCheck;
      } else {
        rangeError = test;
        return false;
      }
    } else {
      equalsToDiscriminant = {
        "type": "BinaryExpression",
        "operator": "===",
        "left": self.parent.discriminant,
        "right": test.codegen()
      };
    }
    

    if (!self.test) {
      self.test = equalsToDiscriminant;
    } else {
      self.test = {
        "type": "LogicalExpression",
        "operator": "||",
        "left": self.test,
        "right": equalsToDiscriminant
      };
    }
  });
  
  if (rangeError) {
    Node.getErrorManager().error({
      type: "EmptyRange",
      message: "empty range in case clause is disallowed.",
      loc: rangeError.loc
    });
    
    return false;
  }
        
  self.consequent = self.body.codegen();
  self.alternate = null;
  
  return self;
};