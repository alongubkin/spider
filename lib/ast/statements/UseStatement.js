var Node = require('../Node').Node;

exports.UseStatement = function (identifiers) {
  var self = this;
  Node.call(self);
  
  self.type = 'UseStatement';
  
  self.identifiers = identifiers;
  self.identifiers.forEach(function (id) {
    id.parent = self;
  });
};

exports.UseStatement.predefinedCollections = {
  'browser': [
    'document',
    'window',
    'screen',
    'location',
    'navigator',
    'alert',
    'console'
  ],
  
  'node': [
    'require',
    'exports',
    'module',
    'global',
    'console',
    'process'
  ]
};

exports.UseStatement.prototype = Object.create(Node);

exports.UseStatement.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  var context = this.getContext().node;
  
  this.identifiers.forEach(function (id) {
    if (id.predefinedCollection) {
      exports.UseStatement.predefinedCollections[id.name]
        .forEach(function (p) {
          context.defineIdentifier({ name: p });
        });
    } else {
      context.defineIdentifier(id);
    }
  });
  
  return null;
};