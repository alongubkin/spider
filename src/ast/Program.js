var Node = require('./Node').Node;

exports.Program = function (body) { 
  var self = this;
  Node.call(self);
  
  self.type = 'Program';
  self.body = body;
  
  body.forEach(function (statement, i) {
    if (statement) {
      statement.parent = self;
    } else {
      body[i] = { type: 'EmptyStatement' };
    }
  });
};

exports.Program.prototype = Object.create(Node);

exports.Program.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  var i = 0;
  while (i < this.body.length) {
    var statement = this.body[i];
    
    if (!statement || statement.codeGenerated) {
      i++;
      continue;
    }
    
    if (statement.codegen && statement.codegen()) {
      this.body[this.body.indexOf(statement)] = statement;
      i++;
    } else {
      this.body.splice(i, 1);
    }
  }

  return this;
};