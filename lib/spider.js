/*jshint undef:false*/

var Parser = require('jison').Parser,
    fs = require('fs'),
    escodegen = require('escodegen'),
    nodeCLI = require('shelljs-nodecli');
   
var ast = {
  Program: require('./ast/Program').Program,
  VariableDeclarator: require('./ast/VariableDeclarator').VariableDeclarator,
  AssignmentExpression: require('./ast/expressions/AssignmentExpression').AssignmentExpression,
  BinaryExpression: require('./ast/expressions/BinaryExpression').BinaryExpression,
  CallExpression: require('./ast/expressions/CallExpression').CallExpression,
  ExistentialExpression: require('./ast/expressions/ExistentialExpression').ExistentialExpression,
  LogicalExpression: require('./ast/expressions/LogicalExpression').LogicalExpression,
  MemberExpression: require('./ast/expressions/MemberExpression').MemberExpression,
  NullCheckCallExpression: require('./ast/expressions/NullCheckCallExpression').NullCheckCallExpression,
  NullCoalescingExpression: require('./ast/expressions/NullCoalescingExpression').NullCoalescingExpression,
  NullPropagatingExpression: require('./ast/expressions/NullPropagatingExpression').NullPropagatingExpression,
  UnaryExpression: require('./ast/expressions/UnaryExpression').UnaryExpression,
  ObjectExpression: require('./ast/expressions/ObjectExpression').ObjectExpression,
  ArrayExpression: require('./ast/expressions/ArrayExpression').ArrayExpression,
  UpdateExpression: require('./ast/expressions/UpdateExpression').UpdateExpression,
  BlockStatement: require('./ast/statements/BlockStatement').BlockStatement,
  ExpressionStatement: require('./ast/statements/ExpressionStatement').ExpressionStatement,
  IfStatement: require('./ast/statements/IfStatement').IfStatement,
  ForStatement: require('./ast/statements/ForStatement').ForStatement,
  VariableDeclarationStatement: require('./ast/statements/VariableDeclarationStatement').VariableDeclarationStatement,
  FunctionDeclarationStatement: require('./ast/statements/FunctionDeclarationStatement').FunctionDeclarationStatement,
  BooleanLiteral: require('./ast/literals/BooleanLiteral').BooleanLiteral,
  NumberLiteral: require('./ast/literals/NumberLiteral').NumberLiteral,
  StringLiteral: require('./ast/literals/StringLiteral').StringLiteral,
  Identifier: require('./ast/literals/Identifier').Identifier,
  Property: require('./ast/Property').Property,
};    
  
var unwrap = /^function\s*\(\)\s*\{\s*return\s*([\s\S]*);\s*\}/;

// Our handy DSL for Jison grammar generation, thanks to
// [Tim Caswell](http://github.com/creationix). For every rule in the grammar,
// we pass the pattern-defining string, the action to run, and extra options,
// optionally. If no action is specified, we simply pass the value of the
// previous nonterminal.
function o(patternString, action, options) {
  patternString = patternString.replace(/\s{2,}/g, ' ');
  // var patternCount = patternString.split(' ').length;
  
  if (!action) {
    return [patternString, '$$ = $1;', options];
  }
  
  var match;
  action = (match = unwrap.exec(action)) ? match[1] : "(" + action + "())";
  
  // All runtime functions we need are defined on "yy"
  action = action.replace(/\bnew /g, '$&yy.');
  action = action.replace(/\b(?:Block\.wrap|extend)\b/g, 'yy.$&');

  // Returns a function which adds location data to the first parameter passed
  // in, and returns the parameter.  If the parameter is not a node, it will
  // just be passed through unaffected.  
  /*var addLocationDataFn = function(first, last) {
    if (!last) {
      return "yy.addLocationDataFn(@" + first + ")";
    } else {
      return "yy.addLocationDataFn(@" + first + ", @" + last + ")";
    }
  };
  
  action = action.replace(/LOC\(([0-9]*)\)/g, addLocationDataFn('$1'));
  action = action.replace(/LOC\(([0-9]*),\s*([0-9]*)\)/g, addLocationDataFn('$1', '$2'));*/
  
  return [patternString, "$$ = " + /*(addLocationDataFn(1, patternCount)) +*/ "(" + action + ");", options];
}

var grammar = {
  program: [
    o('statementList EOF', function () { 
      return new Program($1);
    })
  ],
  
  statementList: [
    o('statement', function () { 
      return [$1]; 
    }),
    o('statement statementList', function () {
      return [$1].concat($2);
    })
  ],
  
  statement: [
    o('primaryStatement'),
    o('blockStatement'),
  ],
  
  emptyStatement: [
    o(';', function () {
      return null;
    })
  ],
  
  expressionWithSemicolon: [
    o('emptyStatement'),
    o('expression ;'),
  ],
  
  primaryStatement: [
    o('emptyStatement'),
    o('callStatement'),
    o('assignmentStatement'),
    o('updateStatement'),    
    o('variableDeclarationStatement'),
    o('functionDeclarationStatement')
  ],
   
  blockStatement: [
    o('block'),
    o('ifStatement'),
    o('forStatement')
  ],
   
  callStatement: [
    o('callExpression ;', function () {
      return new ExpressionStatement($1);
    })    
  ],
  
  assignmentStatement: [
    o('assignmentExpression ;', function () {
      return new ExpressionStatement($1);
    })    
  ],
  
  updateStatement: [
    o('updateExpression ;', function () {
      return new ExpressionStatement($1);
    })    
  ],
  
  assignable: [
    o('identifier'),
    o('memberExpression'),
  ],
  
  expression: [
    o('identifier'),
    o('literal'),
    o('logicalExpression'),
    o('comparisonExpression'),
    o('nullCoalescingExpression'),
    o('unaryExpression'),
    o('arithmeticExpression'),
    o('parenthesizedExpression'),
    o('nullPropagatingExpression'),
    o('existentialExpression'),
    o('memberExpression'),
    o('objectExpression'),
    o('assignmentExpression'),
    o('callExpression'),
    o('updateExpression'),
    o('arrayExpression')
  ],
    
  logicalExpression: [
    o('expression LOGIC expression', function () {
      return new LogicalExpression($1, $2, $3);
    })
  ],
    
  comparisonExpression: [
    o('expression COMPARISON expression', function () {
      return new BinaryExpression($1, $2, $3);
    })
  ],
  
  assignmentExpression: [
    o('expression = expression', function () {
      return new AssignmentExpression($1, $3);
    })
  ],
  
  nullCoalescingExpression: [
    o('expression ?? expression', function () {
      return new NullCoalescingExpression($1, $3);
    })
  ],
  
  unaryExpression: [
    o('UNARY expression', function () {
      return new UnaryExpression('!', $2);
    }, { "prec": "UNARY" }),
    o('+ expression', function () {
      return new UnaryExpression($1, $2);
    }, { "prec": "UNARY_MATH" }),
    o('- expression', function () {
      return new UnaryExpression($1, $2);
    }, { "prec": "UNARY_MATH" })    
  ],
  
  arithmeticExpression: [
    o('expression + expression', function () {
      return new BinaryExpression($1, '+', $3);
    }),
    o('expression - expression', function () {
      return new BinaryExpression($1, '-', $3);
    }),
    o('expression MATH expression', function () {
      return new BinaryExpression($1, $2, $3);
    })
  ],
  
  parenthesizedExpression: [
    o('( expression )', function () {
      return $2;
    })
  ],
  
  arguments: [
    o('expression', function () {
      return [$1];
    }),
    o('expression , arguments', function () {
      return [$1].concat($3);
    })    
  ],
  
  callExpression: [
    o('expression ( )', function () {
      var exp = $1;
      if ($1.type === 'ExistentialExpression') {
        return new NullCheckCallExpression(exp.argument, []); 
      }
      
      return new CallExpression(exp, []);
    }),
    o('expression ( arguments )', function () {
      var exp = $1;
      if ($1.type === 'ExistentialExpression') {
        return new NullCheckCallExpression(exp.argument, $3); 
      }
      
      return new CallExpression(exp, $3);
    })
  ], 

  nullPropagatingExpression: [
    o('expression ?. identifier', function () {
      return new NullPropagatingExpression($1, $3);
    })
  ],
  
  existentialExpression: [
    o('expression ?', function () {
      return new ExistentialExpression($1);
    })
  ],

  memberExpression: [
    o('expression . identifier', function () {
      return new MemberExpression($1, $3);
    })
  ],
  
  updateExpression: [
    o('expression UPDATE', function () {
      return new UpdateExpression($1, $2, false);
    }),
    o('UPDATE expression', function () {
      return new UpdateExpression($2, $1, true);
    })    
  ],
  
  objectExpression: [
    o('EMPTY_OBJECT', function () {
      return new ObjectExpression([]);
    }),
    o('{ properties }', function () {
      return new ObjectExpression($2);
    })
  ],
  
  property: [
    o('identifier : expression', function () {
      return new Property($1, $3);
    }),
    o('stringLiteral : expression', function () {
      return new Property($1, $3);
    })
  ],
  
  properties: [
    o('property', function () {
      return [$1];
    }),
    o('property ,', function () {
      return [$1];
    }),
    o('property , properties', function () {
      return [$1].concat($3);
    })
  ],
  
  arrayExpression: [
    o('[]', function () {
      return new ArrayExpression([]);
    }),
    o('[ arrayElements ]', function () {
      return new ArrayExpression($2);
    })
  ],
  
  arrayElements: [
    o('expression', function () {
      return [$1];
    }),
    o('expression ,', function () {
      return [$1];
    }),
    o('expression , arrayElements', function () {
      return [$1].concat($3);
    })
  ],
  
  block: [
    o('{ }', function () {
      return new BlockStatement([]);
    }),
    o('{ statementList }', function () {
      return new BlockStatement($2);
    })
  ],
  
  variableDeclarationStatement: [
    o('var variableDeclaratorList ;', function () {
      return new VariableDeclarationStatement($2);
    })
  ],
  
  variableDeclaratorList: [
    o('variableDeclarator', function () {
      return [$1];
    }),
    o('variableDeclarator , variableDeclaratorList', function () {
      return [$1].concat($3);
    })
  ],
  
  variableDeclarator: [
    o('identifier', function () {
      return new VariableDeclarator($1);
    }),
    o('identifier initialiser', function () {
      return new VariableDeclarator($1, $2);
    })
  ],
  
  initialiser: [
    o('= expression', function () {
      return $2;
    })
  ],
  
  ifStatement: [
    o('if expression block', function () {
      return new IfStatement($2, $3);
    }),
    o('if expression block else statement', function () {
      return new IfStatement($2, $3, $5);
    })  
  ],
  
  forStatement: [
    o('for primaryStatement expressionWithSemicolon block', function () {
      return new ForStatement($2, $3, null, $4);
    }),  
    o('for primaryStatement expressionWithSemicolon expression block', function () {
      return new ForStatement($2, $3, $4, $5);
    })
  ],
 
  functionDeclarationArguments: [
    o('identifier', function () {
      return [$1];
    }),
    o('identifier , functionDeclarationArguments', function () {
      return [$1].concat($3);
    })
  ],
  
  functionDeclarationStatement: [
    o('func identifier ( ) block', function () {
      return new FunctionDeclarationStatement($2, [], $5);
    }),
    o('func identifier ( functionDeclarationArguments ) block', function () {
      return new FunctionDeclarationStatement($2, $4, $6);
    }),
  ],
  
  stringLiteral: [
    o('STRING', function () {
      return new StringLiteral(yytext);
    })
  ],
  
  numberLiteral: [
    o('NUMBER', function () {
      return new NumberLiteral(yytext);
    })
  ],
  
  booleanLiteral: [
    o('true', function () {
      return new BooleanLiteral('true');
    }),
    o('false', function () {
      return new BooleanLiteral('false');
    })
  ],
  
  literal: [
    o('stringLiteral'),
    o('numberLiteral'),
    o('booleanLiteral')
  ],
  
  identifier: [
    o('IDENTIFIER', function () {
      return new Identifier($1);
    })
  ]
};

// Finally, now that we have our **grammar** and our **operators**, we can create
// our **Jison.Parser**. We do this by processing all of our rules, recording all
// terminals (every symbol which does not appear as the name of a rule above)
// as "tokens".
var tokens = ['NUMBER', 'IDENTIFIER', 'STRING'];

var rules = [
  ["\\s+", "/* skip whitespace */"],
  ["\\{\\}", "return 'EMPTY_OBJECT'; "],
  ["[0-9]+(\\.[0-9]+)?\\b", "return 'NUMBER';"],
  
  ["\\&\\&", "return 'LOGIC';"],
  ["and\\b", "return 'LOGIC';"],  
  ["\\|\\|", "return 'LOGIC';"],
  ["or\\b", "return 'LOGIC';"],  
  
  ["\\=\\=", "return 'COMPARISON';"],
  ["\\!\\=", "return 'COMPARISON';"],
  ["\\>\\=", "return 'COMPARISON';"],
  ["\\>", "return 'COMPARISON';"],
  ["\\<\\=", "return 'COMPARISON';"],
  ["\\<", "return 'COMPARISON';"],
  
  ["\\!", "return 'UNARY';"],
    
  ["\\*", "return 'MATH';"],
  ["\\/", "return 'MATH';"],  
  
  ["\\+\\+", "return 'UPDATE';"],
  ["\\-\\-", "return 'UPDATE';"],
];

function regexify(token) {
  var chars = token.split('');
  chars.forEach(function (character, i) {
    if (character < 'a' || character > 'z') {
      chars[i] = '\\' + character;
    }
  });
  
  var lastChar = chars[chars.length - 1];
  if ((lastChar >= 'a' && lastChar <= 'z')) {
    chars[chars.length - 1] = lastChar + '\\b';
  }
  
  return chars.join('');
}

Object.keys(grammar).forEach(function (name) {
  var alternatives = grammar[name];
  alternatives.forEach(function (alt) {
    alt[0].split(' ').forEach(function (token) {
      if (tokens.indexOf(token) === -1 && 
          !grammar[token] && 
          token !== 'EOF') {
        rules.push([regexify(token), ["return '", token, "';"].join('')]);
        tokens.push(token);
      }
    });
    
    if (name === 'program') {
      alt[1] = alt[1].replace('$$ = ', 'return ');
    }
  });
});

rules.push([
  '\"(\\.|[^"])*\"', 
  "return 'STRING';"
]);

rules.push([
  "[_a-zA-Z][_a-zA-Z0-9]{0,30}",
  "return 'IDENTIFIER';"
]);

rules.push([
  "$", 
  "return 'EOF';"
]);

var operators = [
  ["right", "="],
  ["left", "LOGIC"],
  ["left", "COMPARISON"],
  ["left", "??"],
  
  ["left", "+", "-"],
  ["left", "MATH"],
 
  ["right", "UNARY_MATH"],
  ["left", "UNARY"],
  
  ["nonassoc", "UPDATE"],
  
  ["left", "(", ")"],
  ["left", "."],
  
  ["left", "?"],
  ["left", "?."],
];
 

// Initialize the **Parser** with our list of terminal **tokens**, our **grammar**
// rules, and the name of the root. Reverse the operators because Jison orders
// precedence from low to high, and we have it high to low
// (as in [Yacc](http://dinosaur.compilertools.net/yacc/index.html)).
var parser = new Parser({
  lex: {
    rules: rules
  },
  operators: operators,
  start: 'program',
  bnf: grammar
});

parser.yy = ast;

exports.compile = function (text, verbose, lint, fn) {
  ast.NullPropagatingExpression.resetVariableNames();
  ast.NullCoalescingExpression.resetVariableNames();
  ast.NullCheckCallExpression.resetVariableNames();
  ast.ExistentialExpression.resetVariableNames();  
  
  var parsed = parser.parse(text);
  
  var pretty = JSON.stringify(parsed, null, 4);
  var tree = parsed.codegen();
  //var pretty = JSON.stringify(tree, null, 4);
  if (verbose) {
    console.log(pretty);
  }
  
  var js = escodegen.generate(tree, {
    format: { quotes: 'double' }
  });

  if (verbose) {
    console.log(js);
  }
  
  if (lint) {
    fs.writeFile('output.js', ['"use strict";\n\n', js, '\n'].join(''), function () {
      nodeCLI.exec('eslint', '-c eslint.json output.js', {silent:true}, function (code, output) {
        fn(js, output);
      });
    });
  } else {
    fn(js);
  }
};