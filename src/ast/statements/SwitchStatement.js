var Node = require('../Node').Node;

exports.SwitchStatement = function (discriminant, cases) {
  var self = this;
  Node.call(this);
  
  self.type = 'SwitchStatement';
  
  self.discriminant = discriminant;
  self.discriminant.parent = this;
  
  self.cases = cases;
  self.cases.forEach(function (caseClause) {
    caseClause.parent = self;
  });
};

exports.SwitchStatement.prototype = Object.create(Node);

exports.SwitchStatement.prototype.codegen = function () {
  var self = this;
  
  if (!Node.prototype.codegen.call(self)) {
    return;
  }
  
  self.discriminant = self.discriminant.codegen();
  
  var firstCase, currentCase, defaultCase;
  self.cases.forEach(function (caseClause) {
    if (!caseClause.tests) {
      defaultCase = caseClause;
      return;
    }
    
    if (!firstCase) {
      firstCase = caseClause.codegen();
      currentCase = firstCase;
    } else {
      currentCase.alternate = caseClause.codegen();
      currentCase = currentCase.alternate;
    }
  });
  
  if (defaultCase) {
    if (!firstCase) {
      Node.getErrorManager().error({
        type: "SingleDefaultClause",
        message: "default clause without other case clauses is disallowed.",
        loc: defaultCase.loc
      });
    } else {
      currentCase.alternate = defaultCase.codegen();
    }
  }
  
  if (!firstCase) {
    self.type = "ExpressionStatement";
    self.expression = self.discriminant;
  } else {
    self.type = firstCase.type;
    self.test = firstCase.test;
    self.consequent = firstCase.consequent;
    self.alternate = firstCase.alternate;
  }
  
  return self;
};