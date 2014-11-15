/*global describe,it*/
'use strict';

var should = require('should'),
    spider = require('../lib/spider.js');
    
function generateTest(code, expectation) {
  return function () {
    should(spider.compile(code, false, []))
      .be.exactly(expectation);
  };
}

function generateErrorTest(code, expectedErrors) {
  return function () {
    var errors = [];
    spider.compile(code, false, errors);
    
    should(errors.map(function (error) {
      delete error.message;
      delete error.loc;
      
      return error;
    })).eql(expectedErrors);
  };
}

describe('variable statement:', function () {
  it('syntax error', generateErrorTest('var x = y^', [{ type: "SyntaxError" }]));

  it('create variable', 
    generateTest('var a;', 'var a;'));
    
  it('create variable with number literal', 
    generateTest('var a = 5;', 'var a = 5;'));
    
  it('create variable with string literal', 
    generateTest('var a = "test";', 'var a = "test";'));
  
  it('create variable with boolean literal', 
    generateTest('var a = true;', 'var a = true;'));
    
  it('create variable with null literal', 
    generateTest('var a = null;', 'var a = null;'));
    
  it('create variable with identifier value', 
    generateTest('var a = b;', 'var a = b;'));
    
  it('create multiple variables in one statement', 
    generateTest('var a, b;', 'var a, b;'));

  it('create multiple variables in one statement with values', 
    generateTest('var a = 5, b = false;', 'var a = 5, b = false;'));
    
  it('create multiple variables in multiple statements', 
    generateTest('var a; var b;', 'var a;\nvar b;'));  
});

describe('member expressions:', function () {
  it('member expression with 2 nodes', 
    generateTest('var a = b.c;', 'var a = b.c;'));
    
  it('member expression with 3 nodes', 
    generateTest('var a = b.c.d;', 'var a = b.c.d;'));
    
  it('member expression with 4 nodes', 
    generateTest('var a = b.c.d.e;', 'var a = b.c.d.e;'));    
});

describe('null propagating member expressions:', function () {
  it('null propagating member expression with 2 nodes', 
    generateTest('var a = b?.c;', 
      'var a = typeof b !== "undefined" && b !== null ? b.c : void 0;'));
    
  it('null propagating member expression with 3 nodes', 
    generateTest('var a = b?.c?.d;', 
      'var a = typeof b !== "undefined" && (b !== null && b.c !== null) ? b.c.d : void 0;'));
      
  it('null propagating member expression with 4 nodes', 
    generateTest('var a = b?.c?.d?.e;', 
      'var a = typeof b !== "undefined" && (b !== null && b.c !== null && b.c.d !== null) ? b.c.d.e : void 0;'));
});

describe('member and null propagating member expressions:', function () {
  it('1 member expression and 1 null propagating member expression', 
    generateTest('var a = b.c?.d;', 
      'var a = typeof b.c !== "undefined" && b.c !== null ? b.c.d : void 0;'));
      
  it('2 member expressions and 1 null propagating member expression', 
    generateTest('var a = b.c.d?.e;', 
      'var a = typeof b.c.d !== "undefined" && b.c.d !== null ? b.c.d.e : void 0;'));
      
  it('3 member expressions and 1 null propagating member expression', 
    generateTest('var a = b.c.d.e?.f;', 
      'var a = typeof b.c.d.e !== "undefined" && b.c.d.e !== null ? b.c.d.e.f : void 0;'));
      
  it('1 member expression and 2 null propagating member expressions', 
    generateTest('var a = b.c?.d?.e;', 
      'var a = typeof b.c !== "undefined" && (b.c !== null && b.c.d !== null) ? b.c.d.e : void 0;'));
      
  it('1 member expression and 3 null propagating member expressions', 
    generateTest('var a = b.c?.d?.e?.f;', 
      'var a = typeof b.c !== "undefined" && (b.c !== null && b.c.d !== null && b.c.d.e !== null) ? b.c.d.e.f : void 0;'));
      
  it('2 member expressions and 2 null propagating member expressions', 
    generateTest('var a = b.c.d?.e?.f;', 
      'var a = typeof b.c.d !== "undefined" && (b.c.d !== null && b.c.d.e !== null) ? b.c.d.e.f : void 0;'));
      
  it('3 member expressions and 3 null propagating member expressions', 
    generateTest('var a = b.c.d.e?.f?.g?.h;', 
      'var a = typeof b.c.d.e !== \"undefined\" && (b.c.d.e !== null && b.c.d.e.f !== null && b.c.d.e.f.g !== null) ? b.c.d.e.f.g.h : void 0;'));
      
  it('1 null propagating member expression and 1 member expression', 
    generateTest('var a = b?.c;', 
      'var a = typeof b !== \"undefined\" && b !== null ? b.c : void 0;')); 
 
  it('2 null propagating member expressions and 1 member expression', 
    generateTest('var a = b?.c?.d.e;', 
      'var a = typeof b !== "undefined" && (b !== null && b.c !== null) ? b.c.d.e : void 0;')); 
      
  it('3 null propagating member expressions and 1 member expression', 
    generateTest('var a = b?.c?.d?.e.f;', 
      'var a = typeof b !== "undefined" && (b !== null && b.c !== null && b.c.d !== null) ? b.c.d.e.f : void 0;'));
      
  it('1 null propagating member expression and 2 member expressions', 
    generateTest('var a = b?.c.d;', 
      'var a = typeof b !== "undefined" && b !== null ? b.c.d : void 0;'));

  it('1 null propagating member expression and 3 member expressions', 
    generateTest('var a = b?.c.d.e;', 
      'var a = typeof b !== "undefined" && b !== null ? b.c.d.e : void 0;'));
      
  it('2 null propagating member expressions and 2 member expressions', 
    generateTest('var a = b?.c?.d.e.f;', 
      'var a = typeof b !== "undefined" && (b !== null && b.c !== null) ? b.c.d.e.f : void 0;'));

  it('3 null propagating member expression and 2 member expressions', 
    generateTest('var a = b?.c?.d?.e.f.g;', 
      'var a = typeof b !== "undefined" && (b !== null && b.c !== null && b.c.d !== null) ? b.c.d.e.f.g : void 0;'));

  it('3 null propagating member expression and 3 member expressions', 
    generateTest('var a = b?.c?.d?.e.f.g.h;', 
      'var a = typeof b !== "undefined" && (b !== null && b.c !== null && b.c.d !== null) ? b.c.d.e.f.g.h : void 0;'));

  it('1 member expression, 1 null propagating member expression, 1 member expression', 
    generateTest('var a = b.c?.d.e;', 
      'var a = typeof b.c !== "undefined" && b.c !== null ? b.c.d.e : void 0;'));
      
  it('2 member expressions, 1 null propagating member expression, 1 member expression', 
    generateTest('var a = b.c.d?.e.f;', 
      'var a = typeof b.c.d !== "undefined" && b.c.d !== null ? b.c.d.e.f : void 0;')); 

  it('1 member expression, 2 null propagating member expressions, 1 member expression', 
    generateTest('var a = b.c?.d?.e.f;', 
      'var a = typeof b.c !== \"undefined\" && (b.c !== null && b.c.d !== null) ? b.c.d.e.f : void 0;'));

  it('1 member expression, 1 null propagating member expression, 2 member expressions', 
    generateTest('var a = b.c?.d.e.f;', 
      'var a = typeof b.c !== "undefined" && b.c !== null ? b.c.d.e.f : void 0;'));

  it('1 null propagating member expression, 1 member expression, 1 null propagating member expression', 
    generateTest('var a = b?.c.d?.e;', 
      'var nullPropagating0 = typeof b !== \"undefined\" && b !== null ? b.c.d : void 0;\nvar a = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.e : void 0;'));
  
  it('2 null propagating member expressions, 1 member expression, 1 null propagating member expression', 
    generateTest('var a = b?.c?.d.e?.f;', 
      'var nullPropagating0 = typeof b !== \"undefined\" && (b !== null && b.c !== null) ? b.c.d.e : void 0;\nvar a = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.f : void 0;'));
  
  it('3 null propagating member expressions, 1 member expression, 1 null propagating member expression', 
    generateTest('var a = b?.c?.d?.e.f?.h;', 
      'var nullPropagating0 = typeof b !== \"undefined\" && (b !== null && b.c !== null && b.c.d !== null) ? b.c.d.e.f : void 0;\nvar a = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.h : void 0;'));
  
  it('1 null propagating member expression, 2 member expressions, 1 null propagating member expression', 
    generateTest('var a = b?.c.d.e?.f;', 
      'var nullPropagating0 = typeof b !== \"undefined\" && b !== null ? b.c.d.e : void 0;\nvar a = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.f : void 0;'));
  
  it('1 null propagating member expression, 3 member expressions, 1 null propagating member expression', 
    generateTest('var a = b?.c.d.e.f?.h;', 
      'var nullPropagating0 = typeof b !== \"undefined\" && b !== null ? b.c.d.e.f : void 0;\nvar a = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.h : void 0;'));
  
  it('1 null propagating member expression, 1 member expression, 2 null propagating member expressions', 
    generateTest('var a = b?.c.d?.e?.f;', 
      'var nullPropagating0 = typeof b !== \"undefined\" && b !== null ? b.c.d : void 0;\nvar a = typeof nullPropagating0 !== \"undefined\" && (nullPropagating0 !== null && nullPropagating0.e !== null) ? nullPropagating0.e.f : void 0;'));      
      
  it('1 null propagating member expression, 1 member expression, 3 null propagating member expressions', 
    generateTest('var a = b?.c.d?.e?.f?.h;', 
      'var nullPropagating0 = typeof b !== \"undefined\" && b !== null ? b.c.d : void 0;\nvar a = typeof nullPropagating0 !== \"undefined\" && (nullPropagating0 !== null && nullPropagating0.e !== null && nullPropagating0.e.f !== null) ? nullPropagating0.e.f.h : void 0;'));        
  
  it('scramble member and null propagating member expressions (1)',
    generateTest('var a = b?.c.d?.e.f;', 
      'var nullPropagating0 = typeof b !== \"undefined\" && b !== null ? b.c.d : void 0;\nvar a = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.e.f : void 0;'));
     
  it('scramble member and null propagating member expressions (2)',
    generateTest('var a = b?.c?.d.e?.f?.g.h?.i;', 
      'var nullPropagating0 = typeof b !== \"undefined\" && (b !== null && b.c !== null) ? b.c.d.e : void 0;\nvar nullPropagating1 = typeof nullPropagating0 !== \"undefined\" && (nullPropagating0 !== null && nullPropagating0.f !== null) ? nullPropagating0.f.g.h : void 0;\nvar a = typeof nullPropagating1 !== \"undefined\" && nullPropagating1 !== null ? nullPropagating1.i : void 0;'));
});

describe('call expressions and statements:', function () {
  it('call statement without arguments',
    generateTest('fn();', 'fn();'));
     
  it('call statement with 1 argument',
    generateTest('fn(1);', 'fn(1);'));
    
  it('call statement with 2 arguments',
    generateTest('fn(1, true);', 
      'fn(1, true);'));
    
  it('call statement with 3 arguments',
    generateTest('fn(1, true, "test");', 
      'fn(1, true, "test");'));
    
  it('call statement with 4 arguments',
    generateTest('fn(1, true, "test", { a: 1 });', 
      'fn(1, true, "test", { a: 1 });'));
      
  it('call expression without arguments',
    generateTest('var a = fn();', 'var a = fn();'));
    
  it('call expression with 1 argument',
    generateTest('var a = fn(1);', 'var a = fn(1);'));
    
  it('call expression with 2 arguments',
    generateTest('var a = fn(1, true);', 
      'var a = fn(1, true);'));
    
  it('call expression with 3 arguments',
    generateTest('var a = fn(1, true, "test");', 
      'var a = fn(1, true, "test");'));
    
  it('call expression with 4 arguments',
    generateTest('var a = fn(1, true, "test", { a: 1 });', 
      'var a = fn(1, true, "test", { a: 1 });'));
});

describe('call statements with member expressions:', function () {
  it('1 member expression and 1 call statement', 
    generateTest('a.fn();', 'a.fn();'));
    
  it('2 member expressions and 1 call statement', 
    generateTest('a.b.fn();', 'a.b.fn();'));
    
  it('3 member expressions and 1 call statement', 
    generateTest('a.b.c.fn();', 'a.b.c.fn();'));  
    
  it('1 member expression and 2 call statements', 
    generateTest('a.fn1().fn2();', 'a.fn1().fn2();'));
    
  it('1 member expression and 3 call statements', 
    generateTest('a.fn1().fn2().fn3();', 'a.fn1().fn2().fn3();'));
    
  it('1 member expression, 1 call statement, 1 member expression, 1 call statement', 
    generateTest('a.fn1().b.fn2();', 'a.fn1().b.fn2();'));
    
  it('2 member expression, 2 call statement, 2 member expression, 2 call statement', 
    generateTest('a.b.fn1().fn2().c.d.fn3().fn4();', 'a.b.fn1().fn2().c.d.fn3().fn4();'));    
});

describe('call statements with null propagating member expressions:', function () {
  it('1 null propagating member expression and 1 call statement', 
    generateTest('a?.fn();', 'if (typeof a !== \"undefined\" && a !== null) {\n    a.fn();\n}'));
    
  it('2 null propagating member expressions and 1 call statement', 
    generateTest('a?.b?.fn();', 
      'if (typeof a !== \"undefined\" && (a !== null && a.b !== null)) {\n    a.b.fn();\n}'));
    
  it('3 null propagating member expressions and 1 call statement', 
    generateTest('a?.b?.c?.fn();', 
      'if (typeof a !== \"undefined\" && (a !== null && a.b !== null && a.b.c !== null)) {\n    a.b.c.fn();\n}'));  
    
  it('1 null propagating member expression and 2 call statements', 
    generateTest('a?.fn1()?.fn2();', 
      'var nullPropagating0 = typeof a !== \"undefined\" && a !== null ? a.fn1() : void 0;\nif (typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null) {\n    nullPropagating0.fn2();\n}'));
    
  it('1 null propagating member expression and 3 call statements', 
    generateTest('a?.fn1()?.fn2()?.fn3();', 
      'var nullPropagating0 = typeof a !== \"undefined\" && a !== null ? a.fn1() : void 0;\nvar nullPropagating1 = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.fn2() : void 0;\nif (typeof nullPropagating1 !== \"undefined\" && nullPropagating1 !== null) {\n    nullPropagating1.fn3();\n}'));
    
  it('1 null propagating member expression, 1 call statement, 1 null propagating member expression, 1 call statement', 
    generateTest('a?.fn1()?.b?.fn2();', 
      'var nullPropagating0 = typeof a !== \"undefined\" && a !== null ? a.fn1() : void 0;\nif (typeof nullPropagating0 !== \"undefined\" && (nullPropagating0 !== null && nullPropagating0.b !== null)) {\n    nullPropagating0.b.fn2();\n}'));
    
  it('2 null propagating member expression, 2 call statement, 2 null propagating member expression, 2 call statement', 
    generateTest('a?.b?.fn1()?.fn2()?.c?.d?.fn3()?.fn4();', 
      'var nullPropagating0 = typeof a !== \"undefined\" && (a !== null && a.b !== null) ? a.b.fn1() : void 0;\nvar nullPropagating1 = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.fn2() : void 0;\nvar nullPropagating2 = typeof nullPropagating1 !== \"undefined\" && (nullPropagating1 !== null && nullPropagating1.c !== null && nullPropagating1.c.d !== null) ? nullPropagating1.c.d.fn3() : void 0;\nif (typeof nullPropagating2 !== \"undefined\" && nullPropagating2 !== null) {\n    nullPropagating2.fn4();\n}'));
});

describe('call statements with member and null propagating member expressions:', function () {
  it('1 member expression, 1 call statement, 1 null propagating member expression, 1 call statement',
    generateTest('a.b()?.c();', 
      'var nullPropagating0 = a.b();\nif (typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null) {\n    nullPropagating0.c();\n}'));
  
  it('2 member expressions, 1 call statement, 1 null propagating member expression, 1 call statement',
    generateTest('a.b.c()?.d();', 
      'var nullPropagating0 = a.b.c();\nif (typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null) {\n    nullPropagating0.d();\n}'));        

  it('1 member expression, 2 call statements, 1 null propagating member expression, 1 call statement',
    generateTest('a.b().c()?.d();', 
      'var nullPropagating0 = a.b().c();\nif (typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null) {\n    nullPropagating0.d();\n}'));
  
  it('1 member expression, 1 call statement, 2 null propagating member expressions, 1 call statement',
    generateTest('a.b()?.c?.d();', 
      'var nullPropagating0 = a.b();\nif (typeof nullPropagating0 !== \"undefined\" && (nullPropagating0 !== null && nullPropagating0.c !== null)) {\n    nullPropagating0.c.d();\n}'));
  
  it('1 member expression, 1 call statement, 1 null propagating member expression, 2 call statement',
    generateTest('a.b()?.c().d();', 
      'var nullPropagating0 = a.b();\nif (typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null) {\n    nullPropagating0.c().d();\n}'));
  
  it('1 null propagating member expression, 1 call statement, 1 member expression, 1 call statement',
    generateTest('a?.b().c();', 
      'if (typeof a !== \"undefined\" && a !== null) {\n    a.b().c();\n}'));
      
  it('2 null propagating member expression, 1 call statement, 1 member expression, 1 call statement',
    generateTest('a?.b()?.c().d();', 
      'var nullPropagating0 = typeof a !== \"undefined\" && a !== null ? a.b() : void 0;\nif (typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null) {\n    nullPropagating0.c().d();\n}'));
      
  it('1 null propagating member expression, 2 call statement, 1 member expression, 1 call statement',
    generateTest('a?.b()?.c.d();', 
      'var nullPropagating0 = typeof a !== \"undefined\" && a !== null ? a.b() : void 0;\nif (typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null) {\n    nullPropagating0.c.d();\n}'));        

  it('scramble call statements with member and null propagating member expressions',
    generateTest('a?.b()?.c.d().e.f.g?.h?.i?.j.k();', 
      'var nullPropagating0 = typeof a !== \"undefined\" && a !== null ? a.b() : void 0;\nvar nullPropagating1 = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.c.d().e.f.g : void 0;\nif (typeof nullPropagating1 !== \"undefined\" && (nullPropagating1 !== null && nullPropagating1.h !== null && nullPropagating1.h.i !== null)) {\n    nullPropagating1.h.i.j.k();\n}'));          
});

describe('call expressions with member expressions:', function () {
  it('1 member expression and 1 call expression', 
    generateTest('var x = a.fn();', 'var x = a.fn();'));
    
  it('2 member expressions and 1 call expression', 
    generateTest('var x = a.b.fn();', 'var x = a.b.fn();'));
    
  it('3 member expressions and 1 call expression', 
    generateTest('var x = a.b.c.fn();', 'var x = a.b.c.fn();'));  
    
  it('1 member expression and 2 call expressions', 
    generateTest('var x = a.fn1().fn2();', 'var x = a.fn1().fn2();'));
    
  it('1 member expression and 3 call expressions', 
    generateTest('var x = a.fn1().fn2().fn3();', 'var x = a.fn1().fn2().fn3();'));
    
  it('1 member expression, 1 call expression, 1 member expression, 1 call expression', 
    generateTest('var x = a.fn1().b.fn2();', 'var x = a.fn1().b.fn2();'));
    
  it('2 member expression, 2 call expression, 2 member expression, 2 call expression', 
    generateTest('var x = a.b.fn1().fn2().c.d.fn3().fn4();', 'var x = a.b.fn1().fn2().c.d.fn3().fn4();'));    
});

describe('call expressions with null propagating member expressions:', function () {
  it('1 null propagating member expression and 1 call expression', 
    generateTest('var x = a?.fn();', 'var x = typeof a !== \"undefined\" && a !== null ? a.fn() : void 0;'));
    
  it('2 null propagating member expressions and 1 call expression', 
    generateTest('var x = a?.b?.fn();', 
      'var x = typeof a !== \"undefined\" && (a !== null && a.b !== null) ? a.b.fn() : void 0;'));
    
  it('3 null propagating member expressions and 1 call expression', 
    generateTest('var x = a?.b?.c?.fn();', 
      'var x = typeof a !== \"undefined\" && (a !== null && a.b !== null && a.b.c !== null) ? a.b.c.fn() : void 0;'));  
    
  it('1 null propagating member expression and 2 call expressions', 
    generateTest('var x = a?.fn1()?.fn2();', 
      'var nullPropagating0 = typeof a !== \"undefined\" && a !== null ? a.fn1() : void 0;\nvar x = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.fn2() : void 0;'));
    
  it('1 null propagating member expression and 3 call expressions', 
    generateTest('var x = a?.fn1()?.fn2()?.fn3();', 
      'var nullPropagating0 = typeof a !== \"undefined\" && a !== null ? a.fn1() : void 0;\nvar nullPropagating1 = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.fn2() : void 0;\nvar x = typeof nullPropagating1 !== \"undefined\" && nullPropagating1 !== null ? nullPropagating1.fn3() : void 0;'));
    
  it('1 null propagating member expression, 1 call expression, 1 null propagating member expression, 1 call expression', 
    generateTest('var x = a?.fn1()?.b?.fn2();', 
      'var nullPropagating0 = typeof a !== \"undefined\" && a !== null ? a.fn1() : void 0;\nvar x = typeof nullPropagating0 !== \"undefined\" && (nullPropagating0 !== null && nullPropagating0.b !== null) ? nullPropagating0.b.fn2() : void 0;'));
    
  it('2 null propagating member expression, 2 call expressions, 2 null propagating member expression, 2 call expressions', 
    generateTest('var x = a?.b?.fn1()?.fn2()?.c?.d?.fn3()?.fn4();', 
      'var nullPropagating0 = typeof a !== \"undefined\" && (a !== null && a.b !== null) ? a.b.fn1() : void 0;\nvar nullPropagating1 = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.fn2() : void 0;\nvar nullPropagating2 = typeof nullPropagating1 !== \"undefined\" && (nullPropagating1 !== null && nullPropagating1.c !== null && nullPropagating1.c.d !== null) ? nullPropagating1.c.d.fn3() : void 0;\nvar x = typeof nullPropagating2 !== \"undefined\" && nullPropagating2 !== null ? nullPropagating2.fn4() : void 0;'));
});

describe('call expressions with member and null propagating member expressions:', function () {
  it('1 member expression, 1 call expression, 1 null propagating member expression, 1 call expression',
    generateTest('var x = a.b()?.c();', 
      'var nullPropagating0 = a.b();\nvar x = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.c() : void 0;'));
  
  it('2 member expressions, 1 call expression, 1 null propagating member expression, 1 call expression',
    generateTest('var x = a.b.c()?.d();', 
      'var nullPropagating0 = a.b.c();\nvar x = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.d() : void 0;'));        

  it('1 member expression, 2 call expressions, 1 null propagating member expression, 1 call expression',
    generateTest('var x = a.b().c()?.d();', 
      'var nullPropagating0 = a.b().c();\nvar x = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.d() : void 0;'));
  
  it('1 member expression, 1 call expression, 2 null propagating member expressions, 1 call expression',
    generateTest('var x = a.b()?.c?.d();', 
      'var nullPropagating0 = a.b();\nvar x = typeof nullPropagating0 !== \"undefined\" && (nullPropagating0 !== null && nullPropagating0.c !== null) ? nullPropagating0.c.d() : void 0;'));
  
  it('1 member expression, 1 call expression, 1 null propagating member expression, 2 call expressions',
    generateTest('var x = a.b()?.c().d();', 
      'var nullPropagating0 = a.b();\nvar x = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.c().d() : void 0;'));
  
  it('1 null propagating member expression, 1 call expression, 1 member expression, 1 call expression',
    generateTest('var x = a?.b().c();', 
      'var x = typeof a !== \"undefined\" && a !== null ? a.b().c() : void 0;'));
      
  it('2 null propagating member expression, 1 call expression, 1 member expression, 1 call expression',
    generateTest('var x = a?.b()?.c().d();', 
      'var nullPropagating0 = typeof a !== \"undefined\" && a !== null ? a.b() : void 0;\nvar x = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.c().d() : void 0;'));
      
  it('1 null propagating member expression, 2 call expressions, 1 member expression, 1 call expression',
    generateTest('var x = a?.b()?.c.d();', 
      'var nullPropagating0 = typeof a !== \"undefined\" && a !== null ? a.b() : void 0;\nvar x = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.c.d() : void 0;'));        

  it('scramble call expressions with member and null propagating member expressions',
    generateTest('var x = a?.b()?.c.d().e.f.g?.h?.i?.j.k();', 
      'var nullPropagating0 = typeof a !== \"undefined\" && a !== null ? a.b() : void 0;\nvar nullPropagating1 = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.c.d().e.f.g : void 0;\nvar x = typeof nullPropagating1 !== \"undefined\" && (nullPropagating1 !== null && nullPropagating1.h !== null && nullPropagating1.h.i !== null) ? nullPropagating1.h.i.j.k() : void 0;'));          
});

describe('null coalescing expressions:', function () {
  it('null coalescing expression with 2 identifiers',
    generateTest('var x = a ?? b;', 
      'var x = typeof a === \"undefined\" || a === null ? b : a;'));
      
  it('null coalescing expression with 2 member expressions',
    generateTest('var x = a.b ?? c.d;', 
      'var x = a.b === null ? c.d : a.b;'));

  it('null coalescing expression with 6 member expressions',
    generateTest('var x = a.b.c.d ?? e.f.g.h;', 
      'var x = a.b.c.d === null ? e.f.g.h : a.b.c.d;'));

  it('null coalescing expression with 2 null propagating member expressions',
    generateTest('var x = a?.b ?? c?.d;', 
      'var nullCoalescing0 = typeof a !== \"undefined\" && a !== null ? a.b : void 0;\nvar x = nullCoalescing0 === null ? typeof c !== \"undefined\" && c !== null ? c.d : void 0 : nullCoalescing0;'));
      
  it('null coalescing expression with 6 null propagating member expressions',
    generateTest('var x = a?.b?.c?.d ?? e?.f?.g?.h;', 
      'var nullCoalescing0 = typeof a !== \"undefined\" && (a !== null && a.b !== null && a.b.c !== null) ? a.b.c.d : void 0;\nvar x = nullCoalescing0 === null ? typeof e !== \"undefined\" && (e !== null && e.f !== null && e.f.g !== null) ? e.f.g.h : void 0 : nullCoalescing0;'));
      
  it('null coalescing expression with 6 null propagating member expressions combined',
    generateTest('var x = a?.b.c?.d ?? e.f?.g?.h;', 
      'var nullPropagating0 = typeof a !== \"undefined\" && a !== null ? a.b.c : void 0;\nvar nullCoalescing0 = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.d : void 0;\nvar x = nullCoalescing0 === null ? typeof e.f !== \"undefined\" && (e.f !== null && e.f.g !== null) ? e.f.g.h : void 0 : nullCoalescing0;'));       

  it('null coalescing expression with 2 call expressions',
    generateTest('var x = a() ?? b();', 
      'var nullCoalescing0 = a();\nvar x = nullCoalescing0 === null ? b() : nullCoalescing0;'));

  it('null coalescing expression with 2 call expressions and null propagating member expressions',
    generateTest('var x = a.b()?.c() ?? d?.e().f();', 
      'var nullPropagating0 = a.b();\nvar nullCoalescing0 = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null ? nullPropagating0.c() : void 0;\nvar x = nullCoalescing0 === null ? typeof d !== \"undefined\" && d !== null ? d.e().f() : void 0 : nullCoalescing0;'));    

  it('null coalescing statement',
    generateTest('a() ?? b();', 'var nullCoalescing0 = a();\nif (nullCoalescing0 === null) {\n    b();\n}'));
});

describe('null check call expressions:', function () {
  it('null check call expression',
    generateTest('var x = a?();', 
      'var x = typeof a === \"function\" ? a() : void 0;'));
      
  it('null check call expression with 1 argument',
    generateTest('var a = fn?(1);', 
      'var a = typeof fn === \"function\" ? fn(1) : void 0;'));
    
  it('null check call expression with 2 arguments',
    generateTest('var a = fn?(1, true);', 
      'var a = typeof fn === \"function\" ? fn(1, true) : void 0;'));
    
  it('null check call expression with 3 arguments',
    generateTest('var a = fn?(1, true, "test");', 
      'var a = typeof fn === \"function\" ? fn(1, true, \"test\") : void 0;'));
    
  it('null check call expression with 4 arguments',
    generateTest('var a = fn?(1, true, "test", { a: 1 });', 
      'var a = typeof fn === \"function\" ? fn(1, true, \"test\", { a: 1 }) : void 0;'));
      
  it('call expression with null check call expression',
    generateTest('var x = a?()();', 
      'var x = (typeof a === \"function\" ? a() : void 0)();'));
      
  it('null check call expression with null check call expression',
    generateTest('var x = a?()?();', 
      'var nullCheck0 = typeof a === \"function\" ? a() : void 0;\nvar x = typeof nullCheck0 === \"function\" ? nullCheck0() : void 0;'));
      
  it('null check call expression with member expression',
    generateTest('var x = a?().b;', 
      'var x = typeof a === \"function\" ? a().b : void 0;'));
      
  it('null check call expression with 2 member expressions',
    generateTest('var x = a?().b.c;', 
      'var x = typeof a === \"function\" ? a().b.c : void 0;'));
      
  it('null check call expression with call expression',
    generateTest('var x = a?().b();', 
      'var x = typeof a === \"function\" ? a().b() : void 0;')); 
      
  it('null check call expression with 2 call expressions',
    generateTest('var x = a?().b().c();', 
      'var x = typeof a === \"function\" ? a().b().c() : void 0;')); 
      
  it('member expression with null check call expression',
    generateTest('var x = a.b?();', 
      'var x = typeof a.b === \"function\" ? a.b() : void 0;'));
      
  it('2 member expressions with null check call expression',
    generateTest('var x = a.b.c?();', 
      'var x = typeof a.b.c === \"function\" ? a.b.c() : void 0;'));
      
  it('call expression with null check call expression',
    generateTest('var x = a().b?();', 
      'var nullCheck0 = a().b;\nvar x = typeof nullCheck0 === \"function\" ? nullCheck0() : void 0;'));
  
  it('2 call expression with null check call expression',
    generateTest('var x = a().b().c?();', 
      'var nullCheck0 = a().b().c;\nvar x = typeof nullCheck0 === \"function\" ? nullCheck0() : void 0;'));
      
  it('2 null check call expressions',
    generateTest('var x = a?().b?();', 
      'var nullCheck0 = typeof a === \"function\" ? a().b : void 0;\nvar x = typeof nullCheck0 === \"function\" ? nullCheck0() : void 0;'));
  
  it('3 null check call expressions',
    generateTest('var x = a?().b?().c?();', 
      'var nullCheck0 = typeof a === \"function\" ? a().b : void 0;\nvar nullCheck1 = typeof nullCheck0 === \"function\" ? nullCheck0().c : void 0;\nvar x = typeof nullCheck1 === \"function\" ? nullCheck1() : void 0;'));
      
  it('2 null check call expressions with null propagating relationship',
    generateTest('var x = a?()?.b?();', 
      'var nullPropagating0 = typeof a === \"function\" ? a() : void 0;\nvar x = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null && typeof nullPropagating0.b === \"function\" ? nullPropagating0.b() : void 0;'));       
      
  it('3 null check call expressions with null propagating relationship',
    generateTest('var x = a?()?.b?()?.c();', 
      'var nullPropagating0 = typeof a === \"function\" ? a() : void 0;\nvar nullPropagating1 = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null && typeof nullPropagating0.b === \"function\" ? nullPropagating0.b() : void 0;\nvar x = typeof nullPropagating1 !== \"undefined\" && nullPropagating1 !== null ? nullPropagating1.c() : void 0;'));             
});

describe('null check call statements:', function () {
  it('null check call statement',
    generateTest('a?();', 
      'if (typeof a === \"function\") {\n    a();\n}'));
      
  it('null check call statement with 1 argument',
    generateTest('fn?(1);', 
      'if (typeof fn === \"function\") {\n    fn(1);\n}'));
    
  it('null check call statement with 2 arguments',
    generateTest('fn?(1, true);', 
      'if (typeof fn === \"function\") {\n    fn(1, true);\n}'));
    
  it('null check call statement with 3 arguments',
    generateTest('fn?(1, true, "test");', 
      'if (typeof fn === \"function\") {\n    fn(1, true, \"test\");\n}'));
    
  it('null check call statement with 4 arguments',
    generateTest('fn?(1, true, "test", { a: 1 });', 
      'if (typeof fn === \"function\") {\n    fn(1, true, \"test\", { a: 1 });\n}'));
      
  it('call statement with null check call expression',
    generateTest('a?()();', 
      '(typeof a === \"function\" ? a() : void 0)();'));
      
  it('null check call expression with null check call expression',
    generateTest('a?()?();', 
      'var nullCheck0 = typeof a === \"function\" ? a() : void 0;\nif (typeof nullCheck0 === \"function\") {\n    nullCheck0();\n}'));
      
  it('null check call expression with call statement',
    generateTest('a?().b();', 
      'if (typeof a === \"function\") {\n    a().b();\n}')); 
      
  it('null check call expression with 2 call statements',
    generateTest('a?().b().c();', 
      'if (typeof a === \"function\") {\n    a().b().c();\n}')); 
      
  it('member expression with null check call statement',
    generateTest('a.b?();', 
      'if (typeof a.b === \"function\") {\n    a.b();\n}'));
      
  it('2 member expressions with null check call statement',
    generateTest('a.b.c?();', 
      'if (typeof a.b.c === \"function\") {\n    a.b.c();\n}'));
      
  it('call expression with null check call statement',
    generateTest('a().b?();', 
      'var nullCheck0 = a().b;\nif (typeof nullCheck0 === \"function\") {\n    nullCheck0();\n}'));
  
  it('2 call expression with null check call statement',
    generateTest('a().b().c?();', 
      'var nullCheck0 = a().b().c;\nif (typeof nullCheck0 === \"function\") {\n    nullCheck0();\n}'));
      
  it('2 null check call statements',
    generateTest('a?().b?();', 
      'var nullCheck0 = typeof a === \"function\" ? a().b : void 0;\nif (typeof nullCheck0 === \"function\") {\n    nullCheck0();\n}'));
  
  it('3 null check call statements',
    generateTest('a?().b?().c?();', 
      'var nullCheck0 = typeof a === \"function\" ? a().b : void 0;\nvar nullCheck1 = typeof nullCheck0 === \"function\" ? nullCheck0().c : void 0;\nif (typeof nullCheck1 === \"function\") {\n    nullCheck1();\n}'));
      
  it('2 null check call statements with null propagating relationship',
    generateTest('a?()?.b?();', 
      'var nullPropagating0 = typeof a === \"function\" ? a() : void 0;\nif (typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null && typeof nullPropagating0.b === \"function\") {\n    nullPropagating0.b();\n}'));
      
  it('3 null check call statements with null propagating relationship',
    generateTest('a?()?.b?()?.c();', 
      'var nullPropagating0 = typeof a === \"function\" ? a() : void 0;\nvar nullPropagating1 = typeof nullPropagating0 !== \"undefined\" && nullPropagating0 !== null && typeof nullPropagating0.b === \"function\" ? nullPropagating0.b() : void 0;\nif (typeof nullPropagating1 !== \"undefined\" && nullPropagating1 !== null) {\n    nullPropagating1.c();\n}'));             
});

describe('existential expressions:', function () {
  it('existential opreator on identifier',
    generateTest('var x = a?;', 
      'var x = typeof a !== \"undefined\" && a !== null;'));

  it('existential opreator on call expression',
    generateTest('var x = a()?;', 
      'var existential0 = a();\nvar x = typeof existential0 !== \"undefined\" && existential0 !== null;'));
      
  it('existential opreator on null check call expression',
    generateTest('var x = a?()?;', 
      'var existential0 = typeof a === \"function\" ? a() : void 0;\nvar x = typeof existential0 !== \"undefined\" && existential0 !== null;'));     
      
  it('existential opreator on member expression',
    generateTest('var x = a.b?;', 
      'var x = typeof a.b !== \"undefined\" && a.b !== null;'));
      
  it('existential opreator on member expression with call expression',
    generateTest('var x = a.b()?;', 
      'var existential0 = a.b();\nvar x = typeof existential0 !== \"undefined\" && existential0 !== null;'));
      
  it('existential opreator on member expression with null check call expression',
    generateTest('var x = a.b?()?;', 
      'var existential0 = typeof a.b === \"function\" ? a.b() : void 0;\nvar x = typeof existential0 !== \"undefined\" && existential0 !== null;'));
      
  it('existential opreator on null propagating member expression',
    generateTest('var x = a?.b?;', 
      'var existential0 = typeof a !== \"undefined\" && a !== null ? a.b : void 0;\nvar x = typeof existential0 !== \"undefined\" && existential0 !== null;'));
      
  it('existential opreator on propagating member expression with call expression',
    generateTest('var x = a?.b()?;', 
      'var existential0 = typeof a !== \"undefined\" && a !== null ? a.b() : void 0;\nvar x = typeof existential0 !== \"undefined\" && existential0 !== null;'));
      
  it('existential opreator on propagating member expression with null check call expression',
    generateTest('var x = a?.b?()?;', 
      'var existential0 = typeof a !== \"undefined\" && a !== null && typeof a.b === \"function\" ? a.b() : void 0;\nvar x = typeof existential0 !== \"undefined\" && existential0 !== null;'));      
});

describe('object expressions:', function () {
  it('empty object',
    generateTest('var x = {};', 'var x = {};'));
    
  it('object with number property',
    generateTest('var x = { a: 1 };', 
      'var x = { a: 1 };'));
    
  it('object with boolean property',
    generateTest('var x = { a: true };', 
      'var x = { a: true };'));
    
  it('object with identifier property',
    generateTest('var x = { a: b };', 
      'var x = { a: b };'));
    
  it('object with string property',
    generateTest('var x = { a: "test" };', 
      'var x = { a: "test" };'));
      
  it('object with object property',
    generateTest('var x = { a: { b: 1 } };', 
      'var x = { a: { b: 1 } };'));
      
  it('object with array property',
    generateTest('var x = { a: [true] };', 
      'var x = { a: [true] };'));
      
  it('object with quoted object property name',
    generateTest('var x = { "a b": { b: 1 } };', 
      'var x = { \"a b\": { b: 1 } };'));
      
  it('object with 2 properties',
    generateTest('var x = { a: 1, b: true };', 
      'var x = {\n    a: 1,\n    b: true\n};')); 

  it('object with 3 properties',
    generateTest('var x = { a: 1, b: true, c: b };', 
      'var x = {\n    a: 1,\n    b: true,\n    c: b\n};'));

  it('object with 4 properties',
    generateTest('var x = { a: 1, b: true, c: b, d: "test" };', 
      'var x = {\n    a: 1,\n    b: true,\n    c: b,\n    d: "test"\n};'));         
});

describe('array expressions:', function () {
  it('empty array',
    generateTest('var x = [];', 'var x = [];'));

  it('array with 1 number element',
    generateTest('var x = [1];', 'var x = [1];'));  
    
  it('array with 2 number elements',
    generateTest('var x = [1, 2];', 
      'var x = [\n    1,\n    2\n];'));
    
  it('array with 3 number elements',
    generateTest('var x = [1, 2, 3];', 
      'var x = [\n    1,\n    2,\n    3\n];'));

  it('array with 1 boolean element',
    generateTest('var x = [true];', 
      'var x = [true];'));  
    
  it('array with 2 boolean elements',
    generateTest('var x = [true, false];', 
      'var x = [\n    true,\n    false\n];'));
    
  it('array with 3 boolean elements',
    generateTest('var x = [true, false, true];', 
      'var x = [\n    true,\n    false,\n    true\n];'));
            
  it('array with 1 identifier element',
    generateTest('var x = [a];', 'var x = [a];'));  
    
  it('array with 2 identifier elements',
    generateTest('var x = [a, b];', 
      'var x = [\n    a,\n    b\n];'));
    
  it('array with 3 identifier elements',
    generateTest('var x = [a, b, c];', 
      'var x = [\n    a,\n    b,\n    c\n];'));

  it('array with 1 string element',
    generateTest('var x = ["test"];', 'var x = ["test"];'));  
    
  it('array with 2 string elements',
    generateTest('var x = ["test", "test2"];', 
      'var x = [\n    "test",\n    "test2"\n];'));
    
  it('array with 3 string elements',
    generateTest('var x = ["test", "test2", "test3"];', 
      'var x = [\n    "test",\n    "test2",\n    "test3"\n];'));

  it('array with 1 array element',
    generateTest('var x = [[true]];', 
      'var x = [[true]];'));  
    
  it('array with 2 array elements',
    generateTest('var x = [[true], [false]];', 
      'var x = [\n    [true],\n    [false]\n];'));
    
  it('array with 3 array elements',
    generateTest('var x = [[true], [false], [true]];', 
      'var x = [\n    [true],\n    [false],\n    [true]\n];'));

  it('array with 1 object element',
    generateTest('var x = [{ a: 1 }];', 
      'var x = [{ a: 1 }];'));  
    
  it('array with 2 object elements',
    generateTest('var x = [{ a: 1 }, { b: 2 }];', 
      'var x = [\n    { a: 1 },\n    { b: 2 }\n];'));
    
  it('array with 3 object elements',
    generateTest('var x = [{ a: 1 }, { b: 2 }, { c: 3 }];', 
      'var x = [\n    { a: 1 },\n    { b: 2 },\n    { c: 3 }\n];'));      
});

describe('unary expressions:', function () {
  it('unary not',
    generateTest('var x = !a;', 'var x = !a;'));
    
  it('unary plus',
    generateTest('var x = +5;', 'var x = +5;'));
    
  it('unary minus',
    generateTest('var x = -5;', 'var x = -5;'));
    
  it('typeof identifier',
    generateTest('var x = typeof a;', 
      'var x = typeof a === \"undefined\" ? \"undefined\" : {}.toString.call(a).match(\"/\\\\s([a-zA-Z]+)/\")[1].toLowerCase();'));
      
  it('typeof call expression',
    generateTest('var x = typeof a();', 
      'var x = {}.toString.call(a()).match(\"/\\\\s([a-zA-Z]+)/\")[1].toLowerCase();'));    
});

describe('arithmetic expressions:', function () {
  it('plus with 2 elements',
    generateTest('var x = a+b;', 'var x = a + b;'));
    
  it('plus with 3 elements',
    generateTest('var x = a+b+c;', 'var x = a + b + c;'));
  
  it('minus with 2 elements',
    generateTest('var x = a-b;', 'var x = a - b;'));
    
  it('minus with 3 elements',
    generateTest('var x = a-b-c;', 'var x = a - b - c;'));
    
  it('multipication with 2 elements',
    generateTest('var x = a*b;', 'var x = a * b;'));
    
  it('multipication with 3 elements',
    generateTest('var x = a*b*c;', 'var x = a * b * c;')); 

  it('division with 2 elements',
    generateTest('var x = a/b;', 'var x = a / b;'));
    
  it('division with 3 elements',
    generateTest('var x = a/b/c;', 'var x = a / b / c;'));
    
  it('order of operators',
    generateTest('var x = 3+4*5-(3+4)*5/(a+b-c*d);', 
      'var x = 3 + 4 * 5 - (3 + 4) * 5 / (a + b - c * d);'));    

  it('exponentiation with 2 elements',
    generateTest('var x = a**b;', 'var x = Math.pow(a, b);'));
    
  it('exponentiation with 3 elements',
    generateTest('var x = a**b**c;', 'var x = Math.pow(Math.pow(a, b), c);'));
  
  it('integer division with 2 elements',
    generateTest('var x = a#b;', 'var x = Math.floor(a / b);'));

  it('integer division with 3 elements',
    generateTest('var x = a#b#c;', 'var x = Math.floor(Math.floor(a / b) / c);'));
    
  it('modulo with 2 elements',
    generateTest('var x = a%b;', 'var x = a % b;'));
    
  it('modulo with 3 elements',
    generateTest('var x = a%b%c;', 'var x = a % b % c;'));    
  
  it('math modulo with 2 elements',
    generateTest('var x = a%%b;', 'var x = (a % b + b) % b;'));

  it('math modulo with 3 elements',
    generateTest('var x = a%%b%%c;', 'var x = ((a % b + b) % b % c + c) % c;'));    
});

describe('logical expressions:', function () {
  it('AND expression',
    generateTest('var x = a && b;', 'var x = !!a && !!b;'));
    
  it('2 AND expressions',
    generateTest('var x = a && b && c;', 'var x = !!(!!a && !!b) && !!c;'));
    
  it('worded AND expression',
    generateTest('var x = a and b;', 'var x = !!a && !!b;'));
    
  it('2 worded AND expressions',
    generateTest('var x = a and b and c;', 'var x = !!(!!a && !!b) && !!c;'));

  it('OR expression',
    generateTest('var x = a || b;', 'var x = !!a || !!b;'));
    
  it('2 OR expressions',
    generateTest('var x = a || b || c;', 'var x = !!(!!a || !!b) || !!c;'));
    
  it('worded OR expression',
    generateTest('var x = a or b;', 'var x = !!a || !!b;'));
    
  it('2 worded OR expressions',
    generateTest('var x = a or b or c;', 'var x = !!(!!a || !!b) || !!c;'));
    
  it('order of logical expressions 1',
    generateTest('var x = a && b || c;', 
      'var x = !!(!!a && !!b) || !!c;'));
      
  it('order of logical expressions 2',
    generateTest('var x = a && b || c && d;', 
      'var x = !!(!!a && !!b) || !!(!!c && !!d);'));
      
  it('order of logical expressions 3',
    generateTest('var x = a && b || c && (d || e || f && g);', 
      'var x = !!(!!a && !!b) || !!(!!c && !!(!!(!!d || !!e) || !!(!!f && !!g)));'));
});

describe('binary expressions:', function () {
  it('equals expression',
    generateTest('var x = a == b;', 'var x = a === b;'));
    
  it('not equals expression',
    generateTest('var x = a != b;', 'var x = a !== b;'));
    
  it('larger expression',
    generateTest('var x = a > b;', 'var x = a > b;'));
    
  it('larger or equals expression',
    generateTest('var x = a >= b;', 'var x = a >= b;'));
    
  it('smaller expression',
    generateTest('var x = a < b;', 'var x = a < b;'));
    
  it('smaller or equals expression',
    generateTest('var x = a <= b;', 'var x = a <= b;'));
    
  it('chained comparisons',
    generateTest('var x = a > x > c;', 'var x = a > x && x > c;'));
    
  it('chained comparisons with 2 components',
    generateTest('var x = a > x > c > d;', 'var x = a > x && x > c && c > d;'));

  it('chained comparisons with 3 components',
    generateTest('var x = a > x > c > d > e;', 'var x = a > x && x > c && c > d && d > e;'));    
});

describe('update expressions:', function () {
  it('increment statement',
    generateTest('a++;', 'a++;'));
    
  it('decrement statement',
    generateTest('a--;', 'a--;'));
    
  it('increment expression',
    generateTest('var x = a++;', 'var x = a++;'));
    
  it('decrement expression',
    generateTest('var x = a--;', 'var x = a--;'));
    
  it('increment prefix statement',
    generateTest('++a;', '++a;'));
    
  it('decrement prefix statement',
    generateTest('--a;', '--a;'));
    
  it('increment prefix expression',
    generateTest('var x = ++a;', 'var x = ++a;'));
    
  it('decrement prefix expression',
    generateTest('var x = --a;', 'var x = --a;'));    
});

describe('assignment expressions:', function () {
  it('assignment statement',
    generateTest('a = 1;', 'a = 1;'));
    
  it('assignment statement with 2 variables',
    generateTest('a = b = 1;', 'a = b = 1;'));
    
  it('assignment statement with 3 variables',
    generateTest('a = b = c = 1;', 'a = b = c = 1;'));
    
  it('assignment expression',
    generateTest('var x = a = 1;', 'var x = a = 1;'));
    
  it('assignment expression with 2 variables',
    generateTest('var x = a = b = 1;', 'var x = a = b = 1;'));
    
  it('assignment expression with 3 variables',
    generateTest('var x = a = b = c = 1;', 'var x = a = b = c = 1;'));  

  it('addition assignment',            generateTest('x += a;',   'x += a;'));
  it('subtraction assignment',         generateTest('x -= a;',   'x -= a;'));
  it('multiplication assignment',      generateTest('x *= a;',   'x *= a;'));  
  it('division assignment',            generateTest('x /= a;',   'x /= a;'));
  it('remainder assignment',           generateTest('x %= a;',   'x %= a;'));
  it('left shift assignment',          generateTest('x <<= a;',  'x <<= a;'));
  it('right shift assignment',         generateTest('x >>= a;',  'x >>= a;'));
  it('logical right shift assignment', generateTest('x >>>= a;', 'x >>>= a;'));
  it('bitwise AND assignment',         generateTest('x &= a;',   'x &= a;'));
  it('bitwise XOR assignment',         generateTest('x ^= a;',   'x ^= a;'));
  it('bitwise OR assignment',          generateTest('x |= a;',   'x |= a;'));
});

describe('if statement:', function () {
  it('if statement',
    generateTest('if true { }', 'if (true) {\n}'));
    
  it('if statement with else clause',
    generateTest('if true { } else { }', 'if (true) {\n} else {\n}'));

  it('if statement without block',
    generateTest('if true a();', 'if (true) {\n    a();\n}')); 

  it('if statement with else without block',
    generateTest('if true a(); else b();', 'if (true) {\n    a();\n} else {\n    b();\n}'));     
});

describe('for statement:', function () {
  it('for loop with empty arguments',
    generateTest('for ;; { }', 'for (;;) {\n}'));
    
  it('for loop with initialiser only',
    generateTest('for var i = 0;; { }', 'for (var i = 0;;) {\n}'));  

  it('for loop with condition only',
    generateTest('for ; i > 0; { }', 'for (; i > 0;) {\n}'));
    
  it('for loop with update only',
    generateTest('for ;; i++ { }', 'for (;; i++) {\n}'));

  it('for loop with initialiser and condition',
    generateTest('for var i = 0; i > 0; { }', 'for (var i = 0; i > 0;) {\n}'));

  it('for loop with initialiser and update',
    generateTest('for var i = 0;; i++ { }', 'for (var i = 0;; i++) {\n}'));

  it('for loop with condition and update',
    generateTest('for ; i > 0; i++ { }', 'for (; i > 0; i++) {\n}'));
    
  it('for loop with initialiser, condition and update',
    generateTest('for var i = 0; i > 0; i++ { }', 'for (var i = 0; i > 0; i++) {\n}'));      
});

describe('function declarations:', function () {
  it('func decl without arguments',
    generateTest('func fn() { }', 'function fn() {\n}'));
    
  it('func decl with 1 argument',
    generateTest('func fn(a) { }', 'function fn(a) {\n}'));

  it('func decl with 2 arguments',
    generateTest('func fn(a, b) { }', 'function fn(a, b) {\n}'));

  it('func decl with 3 arguments',
    generateTest('func fn(a, b, c) { }', 'function fn(a, b, c) {\n}'));    
});

describe('function expressions:', function () {
  it('function expression without arguments',
    generateTest('var a = () -> 1;', 
      'var a = function () {\n    return 1;\n};'));
      
  it('function expression with 1 argument',
    generateTest('var a = (a) => a;', 
      'var a = function (a) {\n    return a;\n};'));

  it('function expression with 2 arguments',
    generateTest('var a = (a, b) -> a+b;', 
      'var a = function (a, b) {\n    return a + b;\n};'));

  it('function expression with 3 arguments',
    generateTest('var a = (a, b, c) => a+b-c;', 
      'var a = function (a, b, c) {\n    return a + b - c;\n};')); 
      
  it('block function expression without arguments',
    generateTest('var a = () -> { };', 
      'var a = function () {\n};'));
    
  it('block function expression with 1 argument',
    generateTest('var a = (a) => { };', 
      'var a = function (a) {\n};'));

  it('block function expression with 2 arguments',
    generateTest('var a = (a, b) -> { };', 
      'var a = function (a, b) {\n};'));

  it('block function expression with 3 arguments',
    generateTest('var a = (a, b, c) => { };', 
      'var a = function (a, b, c) {\n};')); 
      
  it('block function expression (func syntax) without arguments',
    generateTest('var a = func () { };', 
      'var a = function () {\n};'));
    
  it('block function expression (func syntax) with 1 argument',
    generateTest('var a = func (a) { };', 
      'var a = function (a) {\n};'));

  it('block function expression (func syntax) with 2 arguments',
    generateTest('var a = func (a, b) { };', 
      'var a = function (a, b) {\n};'));

  it('block function expression (func syntax) with 3 arguments',
    generateTest('var a = func (a, b, c) { };', 
      'var a = function (a, b, c) {\n};'));

  it('block function expression (func syntax with id) without arguments',
    generateTest('var a = func f() { };', 
      'var a = function f() {\n};'));
    
  it('block function expression (func syntax with id) with 1 argument',
    generateTest('var a = func f(a) { };', 
      'var a = function f(a) {\n};'));

  it('block function expression (func syntax with id) with 2 arguments',
    generateTest('var a = func f(a, b) { };', 
      'var a = function f(a, b) {\n};'));

  it('block function expression (func syntax with id) with 3 arguments',
    generateTest('var a = func f(a, b, c) { };', 
      'var a = function f(a, b, c) {\n};'));        
});

describe('return statement:', function () {
  it('function declaration with a return statement',
    generateTest('func x() { return 1; }',
      'function x() {\n    return 1;\n}'));
      
  it('function expression with a return statement',
    generateTest('var a = () -> { return 1; };',
      'var a = function () {\n    return 1;\n};'));

  it('function declaration with empty return statement',
    generateTest('func x() { return; }',
      'function x() {\n    return;\n}'));
      
  it('function expression with empty return statement',
    generateTest('var a = () -> { return; };',
      'var a = function () {\n    return;\n};'));
});

describe('global identifiers and use statements:', function () {
  it('global function call', 
    generateErrorTest('x("test");', 
      [{ type: 'UndefinedIdentifier', 'identifier': 'x' }]));

  it('global function call with :: operator', 
    generateTest('::x("test");', 'x("test");'));
    
  it('global function call with use statement', 
    generateTest('use x; x("test");', 'x("test");'));

  it('global function call with use statement and :: operator', 
    generateTest('use x; ::x("test");', 'x("test");'));
    
  it('global function call with use statement after the function call', 
    generateErrorTest('x("test"); use x;', 
      [{ type: 'UndefinedIdentifier', 'identifier': 'x' }]));
      
  it('global member expression', 
    generateErrorTest('var x = a.b;', 
      [{ type: 'UndefinedIdentifier', 'identifier': 'a' }]));

  it('global member expression with :: operator', 
    generateTest('var x = ::a.b;', 'var x = a.b;'));

  it('global member expression with use statement', 
    generateTest('use a; var x = a.b;', 'var x = a.b;'));

  it('global member expression with use statement and :: operator', 
    generateTest('use a; var x = ::a.b;', 'var x = a.b;'));
    
  it('global member expression with use statement after the member expression', 
    generateErrorTest('var x = a.b; use a;', 
      [{ type: 'UndefinedIdentifier', 'identifier': 'a' }]));

  it('use statement with 2 identifiers', 
    generateErrorTest('use a, b; var x = a + b;', []));      

  it('use statement with 3 identifiers', 
    generateErrorTest('use a, b, c; var x = a + b + c;', []));
    
  it(':browser use statement', 
    generateErrorTest('use :browser; var x = document + console + window;', []));    
});

describe('this keyword:', function () {
  it('call statement with this', 
    generateTest('this.x();', 'this.x();'));
  it('call expression with this', 
    generateTest('var a = this.x();', 'var a = this.x();'));
  it('member expression with this', 
    generateTest('var a = this.x;', 'var a = this.x;'));
  it('call statement and member expression with this', 
    generateTest('this.a.b();', 'this.a.b();'));     
});

describe('func extends:', function () {
  it('extended function with no constructor', 
    generateTest('func A() {} func B() extends A {}', 
      'function A() {\n}\nfunction B() {\n    A.call(this);\n}\nB.prototype = Object.create(A);'));

  it('extended function with empty constructor', 
    generateTest('func A() {} func B() extends A() {}', 
      'function A() {\n}\nfunction B() {\n    A.call(this);\n}\nB.prototype = Object.create(A);'));

  it('extended function with 1-param constructor', 
    generateTest('func A() {} func B() extends A(1) {}', 
      'function A() {\n}\nfunction B() {\n    A.call(this, 1);\n}\nB.prototype = Object.create(A);'));

  it('extended function with 2-params constructor', 
    generateTest('func A() {} func B(a) extends A(1, a) {}', 
      'function A() {\n}\nfunction B(a) {\n    A.call(this, 1, a);\n}\nB.prototype = Object.create(A);'));
      
  it('extended function with global identifier', 
    generateTest('func B() extends ::A {}', 
      'function B() {\n    A.call(this);\n}\nB.prototype = Object.create(A);'));
      
  it('extended function expression with no constructor', 
    generateTest('var A = func () {}; var B = func () extends A {};', 
      'var A = function () {\n};\nvar functionExpression0 = function () {\n    A.call(this);\n};\nfunctionExpression0.prototype = Object.create(A);\nvar B = functionExpression0;'));

  it('extended function expression with empty constructor', 
    generateTest('var A = func () {}; var b = func () extends A() {};', 
      'var A = function () {\n};\nvar functionExpression0 = function () {\n    A.call(this);\n};\nfunctionExpression0.prototype = Object.create(A);\nvar b = functionExpression0;'));

  it('extended function expression with 1-param constructor', 
    generateTest('var A = func () {}; var B = func () extends A(1) {};', 
      'var A = function () {\n};\nvar functionExpression0 = function () {\n    A.call(this, 1);\n};\nfunctionExpression0.prototype = Object.create(A);\nvar B = functionExpression0;'));

  it('extended function expression with 2-params constructor', 
    generateTest('var A = func () {}; var B = func (a) extends A(1, a) {};', 
      'var A = function () {\n};\nvar functionExpression0 = function (a) {\n    A.call(this, 1, a);\n};\nfunctionExpression0.prototype = Object.create(A);\nvar B = functionExpression0;'));
      
  it('extended function expression with global identifier', 
    generateTest('var B = func () extends ::A {};', 
      'var functionExpression0 = function () {\n    A.call(this);\n};\nfunctionExpression0.prototype = Object.create(A);\nvar B = functionExpression0;'));
});

describe('super keyword:', function () {
  it('super call statement in a method', 
    generateTest('func B() extends ::A { this.test = func () { super.test(); }; }', 
      'function B() {\n    A.call(this);\n    var _self = this;\n    var _test = this.test;\n    this.test = function () {\n        _test.call(_self);\n    };\n}\nB.prototype = Object.create(A);'));
      
  it('super call statement in a method inside an anonymous function', 
    generateTest('func B() extends ::A { this.test = func () { (() -> { return super.test(); })(); }; }', 
      'function B() {\n    A.call(this);\n    var _self = this;\n    var _test = this.test;\n    this.test = function () {\n        (function () {\n            return _test.call(_self);\n        }());\n    };\n}\nB.prototype = Object.create(A);'));
  
  it('super call statement in a method inside 2 anonymous functions', 
    generateTest('func B() extends ::A { this.test = func () { (() -> () -> { return super.test(); } )()(); }; }', 
      'function B() {\n    A.call(this);\n    var _self = this;\n    var _test = this.test;\n    this.test = function () {\n        (function () {\n            return function () {\n                return _test.call(_self);\n            };\n        }()());\n    };\n}\nB.prototype = Object.create(A);'));
  
  it('super member expression in a method', 
    generateTest('func B() extends ::A { this.test = func () { var x = super.x; }; }', 
      'function B() {\n    A.call(this);\n    var _x = this.x;\n    this.test = function () {\n        var x = _x;\n    };\n}\nB.prototype = Object.create(A);'));
      
  it('super member expression in a method inside an anonymous function', 
    generateTest('func B() extends ::A { this.test = func () { var x = (() -> super.x)(); }; }', 
      'function B() {\n    A.call(this);\n    var _x = this.x;\n    this.test = function () {\n        var x = function () {\n            return _x;\n        }();\n    };\n}\nB.prototype = Object.create(A);'));
  
  it('super member expression in a method inside 2 anonymous functions', 
    generateTest('func B() extends ::A { this.test = func () { var x = (() -> () -> super.x)()(); }; }', 
      'function B() {\n    A.call(this);\n    var _x = this.x;\n    this.test = function () {\n        var x = function () {\n            return function () {\n                return _x;\n            };\n        }()();\n    };\n}\nB.prototype = Object.create(A);'));

  it('super call statement in a prototype function', 
    generateTest('func B() extends ::A {} B.prototype.test = () -> { super.test(); };', 
      'function B() {\n    A.call(this);\n}\nB.prototype = Object.create(A);\nB.prototype.test = function () {\n    A.prototype.test.call(this);\n};'));
      
  it('super call statement in a prototype function inside an anonymous function', 
    generateTest('func B() extends ::A {} B.prototype.test = () -> { (() -> super.test())(); };', 
      'function B() {\n    A.call(this);\n}\nB.prototype = Object.create(A);\nB.prototype.test = function () {\n    var _self = this;\n    (function () {\n        return A.prototype.test.call(_self);\n    }());\n};'));
      
  it('super member expression in a prototype function', 
    generateTest('func B() extends ::A {} B.prototype.test = () -> { var x = super.x; };', 
      'function B() {\n    A.call(this);\n}\nB.prototype = Object.create(A);\nB.prototype.test = function () {\n    var x = this.x;\n};'));
  
  it('super member expression in a prototype function inside an anonymous function', 
    generateTest('func B() extends ::A {} B.prototype.test = () -> { var x = (() -> { return super.x; })(); };', 
      'function B() {\n    A.call(this);\n}\nB.prototype = Object.create(A);\nB.prototype.test = function () {\n    var _self = this;\n    var x = function () {\n        return _self.x;\n    }();\n};'));
  
  it('super call statement in a prototype object', 
    generateTest('func B() extends ::A {} B.prototype = { test: () -> { super.test(); } };', 
      'function B() {\n    A.call(this);\n}\nB.prototype = Object.create(A);\nB.prototype = {\n    test: function () {\n        A.prototype.test.call(this);\n    }\n};'));
      
  it('super call statement in a prototype object inside an anonymous function', 
    generateTest('func B() extends ::A {} B.prototype = { test: () -> { (() -> super.test())(); } };', 
      'function B() {\n    A.call(this);\n}\nB.prototype = Object.create(A);\nB.prototype = {\n    test: function () {\n        var _self = this;\n        (function () {\n            return A.prototype.test.call(_self);\n        }());\n    }\n};'));
      
  it('super member expression in a prototype object', 
    generateTest('func B() extends ::A {} B.prototype = { test: () -> { var x = super.x; } };', 
      'function B() {\n    A.call(this);\n}\nB.prototype = Object.create(A);\nB.prototype = {\n    test: function () {\n        var x = this.x;\n    }\n};'));
  
  it('super member expression in a prototype object inside an anonymous function', 
    generateTest('func B() extends ::A {} B.prototype = { test: () -> { var x = (() -> { return super.x; })(); } };', 
      'function B() {\n    A.call(this);\n}\nB.prototype = Object.create(A);\nB.prototype = {\n    test: function () {\n        var _self = this;\n        var x = function () {\n            return _self.x;\n        }();\n    }\n};'));   
});

describe('string interpolation:', function () {
  it('string interpolation', 
    generateTest('var x = "test \\(a) test \\(2+a) \\(Math.pow(2, a)) test test";',
      'var x = \"test \" + a + \" test \" + (2 + a) + \" \" + Math.pow(2, a) + \" test test\";'));    
});

describe('bitwise opreators:', function () {
  it('bitwise AND', generateTest('var x = a & b;', 'var x = a & b;'));
  it('bitwise OR',  generateTest('var x = a | b;', 'var x = a | b;'));
  it('bitwise XOR', generateTest('var x = a ^ b;', 'var x = a ^ b;'));
  
  it('arithmetic shift left',  generateTest('var x = a << b;', 'var x = a << b;'));  
  it('arithmetic shift right', generateTest('var x = a >> b;', 'var x = a >> b;'));  
  
  it('logical shift right', generateTest('var x = a >>> b;', 'var x = a >>> b;'));
});

describe('throw statement:', function () {
  it('throw number', generateTest('throw 5;', 'throw 5;'));
  it('throw object', generateTest('throw { message: "test" };', 'throw { message: "test" };'));
});

describe('control flow statements:', function () {
  it('break statement', generateTest('break;', 'break;'));
  it('continue statement', generateTest('continue;', 'continue;'));
});

describe('range expressions:', function () {
  it('upward small inclusive numeric range expression',
    generateTest('var x = [1..5];', 'var x = [\n    1,\n    2,\n    3,\n    4,\n    5\n];'));
    
  it('downward small inclusive numeric range expression',
    generateTest('var x = [5..1];', 'var x = [\n    5,\n    4,\n    3,\n    2,\n    1\n];'));
    
  it('upward small exclusive numeric range expression',
    generateTest('var x = [1...5];', 'var x = [\n    1,\n    2,\n    3,\n    4\n];'));
    
  it('downward small exclusive numeric range expression',
    generateTest('var x = [5...1];', 'var x = [\n    5,\n    4,\n    3,\n    2\n];'));
    
  it('upward large inclusive numeric range expression',
    generateTest('var x = [1..25];', 'var x = function () {\n    var _results = [];\n    for (var _i = 1; _i <= 25; _i++) {\n        _results.push(_i);\n    }\n    return _results;\n}.apply(this);'));
    
  it('downward large inclusive numeric range expression',
    generateTest('var x = [25..1];', 'var x = function () {\n    var _results = [];\n    for (var _i = 25; _i >= 1; _i--) {\n        _results.push(_i);\n    }\n    return _results;\n}.apply(this);'));
    
  it('upward large exclusive numeric range expression',
    generateTest('var x = [1...25];', 'var x = function () {\n    var _results = [];\n    for (var _i = 1; _i < 25; _i++) {\n        _results.push(_i);\n    }\n    return _results;\n}.apply(this);'));
    
  it('downward large exclusive numeric range expression',
    generateTest('var x = [25...1];', 'var x = function () {\n    var _results = [];\n    for (var _i = 25; _i > 1; _i--) {\n        _results.push(_i);\n    }\n    return _results;\n}.apply(this);'));    
    
  it('inclusive identifiers range expression',
    generateTest('var x = [a..b];', 'var x = function () {\n    var _results = [];\n    for (var _i = a; a <= b ? _i <= b : _i >= b; a <= b ? _i++ : _i--) {\n        _results.push(_i);\n    }\n    return _results;\n}.apply(this);'));
  
  it('exclusive identifiers range expression',
    generateTest('var x = [a...b];', 'var x = function () {\n    var _results = [];\n    for (var _i = a; a <= b ? _i < b : _i > b; a <= b ? _i++ : _i--) {\n        _results.push(_i);\n    }\n    return _results;\n}.apply(this);'));
  
  it('inclusive call range expression',
    generateTest('var x = [a()..b()];', 'var x = function () {\n    var _results = [], _start = a(), _end = b();\n    for (var _i = _start; _start <= _end ? _i <= _end : _i >= _end; _start <= _end ? _i++ : _i--) {\n        _results.push(_i);\n    }\n    return _results;\n}.apply(this);'));
  
  it('exclusive call range expression',
    generateTest('var x = [a()...b()];', 'var x = function () {\n    var _results = [], _start = a(), _end = b();\n    for (var _i = _start; _start <= _end ? _i < _end : _i > _end; _start <= _end ? _i++ : _i--) {\n        _results.push(_i);\n    }\n    return _results;\n}.apply(this);'));
});

describe('debugger statement:', function () {
  it('debugger statement', generateTest('debugger;', 'debugger;'));
});

describe('while and until statements:', function () {
  it('while statement', generateTest('while (true) {}', 'while (true) {\n}'));
  it('while statement without block', generateTest('while (true) a();', 'while (true) {\n    a();\n}'));
  
  it('until statement', generateTest('until (true) {}', 'while (!true) {\n}'));
  it('until statement without block', generateTest('until (true) a();', 'while (!true) {\n    a();\n}'));  
});

describe('array slicing:', function () {
  it('inclusive array slice with empty from and to', 
    generateTest('var x = a[..];', 'var x = a.slice(0);'));
    
  it('inclusive array slice with numeric from and empty to', 
    generateTest('var x = a[1..];', 'var x = a.slice(1);'));
    
  it('inclusive array slice with empty from and numeric to', 
    generateTest('var x = a[..1];', 'var x = a.slice(0, 2);'));

  it('inclusive array slice with numeric from and numeric to', 
    generateTest('var x = a[1..2];', 'var x = a.slice(1, 3);'));

  it('inclusive array slice with identifier from and empty to', 
    generateTest('var x = a[c..];', 'var x = a.slice(c);'));
    
  it('inclusive array slice with empty from and identifier to', 
    generateTest('var x = a[..c];', 'var x = a.slice(0, c + 1);'));

  it('inclusive array slice with identifier from and identifier to', 
    generateTest('var x = a[c..d];', 'var x = a.slice(c, d + 1);'));

  it('exclusive array slice with empty from and to', 
    generateTest('var x = a[...];', 'var x = a.slice(0);'));
    
  it('exclusive array slice with numeric from and empty to', 
    generateTest('var x = a[1...];', 'var x = a.slice(1);'));
    
  it('exclusive array slice with empty from and numeric to', 
    generateTest('var x = a[...1];', 'var x = a.slice(0, 1);'));

  it('exclusive array slice with numeric from and numeric to', 
    generateTest('var x = a[1...2];', 'var x = a.slice(1, 2);'));

  it('exclusive array slice with identifier from and empty to', 
    generateTest('var x = a[c...];', 'var x = a.slice(c);'));
    
  it('exclusive array slice with empty from and identifier to', 
    generateTest('var x = a[...c];', 'var x = a.slice(0, c);'));

  it('exclusive array slice with identifier from and identifier to', 
    generateTest('var x = a[c...d];', 'var x = a.slice(c, d);'));     
});

describe('array splicing:', function () {
  it('inclusive array splicing with empty from and to', 
    generateTest('a[..] = [x];', '[].splice.apply(a, [\n    0,\n    9000000000\n].concat([x]));'));
    
  it('inclusive array splicing with numeric from and empty to', 
    generateTest('a[1..] = [x];', '[].splice.apply(a, [\n    1,\n    9000000000\n].concat([x]));'));

  it('inclusive array splicing with empty from and numeric to', 
    generateTest('a[..3] = [x];', '[].splice.apply(a, [\n    0,\n    4\n].concat([x]));'));

  it('inclusive array splicing with numeric from and numeric to', 
    generateTest('a[2..3] = [x];', '[].splice.apply(a, [\n    2,\n    2\n].concat([x]));'));

  it('inclusive array splicing with identifier from and empty to', 
    generateTest('a[t..] = [x];', '[].splice.apply(a, [\n    t,\n    9000000000\n].concat([x]));'));

  it('inclusive array splicing with empty from and numeric to', 
    generateTest('a[..v] = [x];', '[].splice.apply(a, [\n    0,\n    v + 1\n].concat([x]));'));

  it('inclusive array splicing with numeric from and numeric to', 
    generateTest('a[t..v] = [x];', '[].splice.apply(a, [\n    t,\n    v - t + 1\n].concat([x]));'));  

  it('exclusive array splicing with empty from and to', 
    generateTest('a[...] = [x];', '[].splice.apply(a, [\n    0,\n    9000000000\n].concat([x]));'));
    
  it('exclusive array splicing with numeric from and empty to', 
    generateTest('a[1...] = [x];', '[].splice.apply(a, [\n    1,\n    9000000000\n].concat([x]));'));

  it('exclusive array splicing with empty from and numeric to', 
    generateTest('a[...3] = [x];', '[].splice.apply(a, [\n    0,\n    3\n].concat([x]));'));

  it('exclusive array splicing with numeric from and numeric to', 
    generateTest('a[2...3] = [x];', '[].splice.apply(a, [\n    2,\n    1\n].concat([x]));'));

  it('exclusive array splicing with identifier from and empty to', 
    generateTest('a[t...] = [x];', '[].splice.apply(a, [\n    t,\n    9000000000\n].concat([x]));'));

  it('exclusive array splicing with empty from and numeric to', 
    generateTest('a[...v] = [x];', '[].splice.apply(a, [\n    0,\n    v\n].concat([x]));'));

  it('exclusive array splicing with numeric from and numeric to', 
    generateTest('a[t...v] = [x];', '[].splice.apply(a, [\n    t,\n    v - t\n].concat([x]));'));      
});

describe('new expressions:', function () {
  it('new expression with 0 arguments', 
    generateTest('var x = new A();', 'var x = new A();'));
    
  it('new expression with 1 argument', 
    generateTest('var x = new A(1);', 'var x = new A(1);'));
    
  it('new expression with 2 argument', 
    generateTest('var x = new A(1, b());', 'var x = new A(1, b());'));    
});

describe('default func param value:', function () {
  it('func decl with 1 param with default value',
    generateTest('func f(a = 5) {}', 
      'function f(a) {\n    if (a == null) {\n        a = 5;\n    }\n}'));
    
  it('func decl with 2 params with default values',
    generateTest('func f(a = 5, b = 3) {}', 
      'function f(a, b) {\n    if (a == null) {\n        a = 5;\n    }\n    if (b == null) {\n        b = 3;\n    }\n}'));
    
  it('func decl with 2 params - first with default value and second without',
    generateTest('func f(a = 5, b) {}', 
      'function f(a, b) {\n    if (a == null) {\n        a = 5;\n    }\n}'));
    
  it('func decl with 2 params - second with default value and first without',
    generateTest('func f(a, b = 3) {}', 
      'function f(a, b) {\n    if (b == null) {\n        b = 3;\n    }\n}'));  

  it('func decl with 3 params with default values',
    generateTest('func f(a = 5, b = 3, k = { test: 1 }) {}', 
      'function f(a, b, k) {\n    if (a == null) {\n        a = 5;\n    }\n    if (b == null) {\n        b = 3;\n    }\n    if (k == null) {\n        k = { test: 1 };\n    }\n}'));    
   
  it('func expression with 1 param with default value',
    generateTest('var x = (a = 5) -> a;', 
      'var x = function (a) {\n    if (a == null) {\n        a = 5;\n    }\n    return a;\n};'));
    
  it('func expression with 2 params with default values',
    generateTest('var x = func (a = 5, b = 3) {};', 
      'var x = function (a, b) {\n    if (a == null) {\n        a = 5;\n    }\n    if (b == null) {\n        b = 3;\n    }\n};'));
    
  it('func expression with 2 params - first with default value and second without',
    generateTest('var x = func (a = 5, b) {};', 
      'var x = function (a, b) {\n    if (a == null) {\n        a = 5;\n    }\n};'));
    
  it('func expression with 2 params - second with default value and first without',
    generateTest('var x = func (a, b = 3) {};', 
      'var x = function (a, b) {\n    if (b == null) {\n        b = 3;\n    }\n};'));  

  it('func expression with 3 params with default values',
    generateTest('var x = func (a = 5, b = 3, k = { test: 1 }) {};', 
      'var x = function (a, b, k) {\n    if (a == null) {\n        a = 5;\n    }\n    if (b == null) {\n        b = 3;\n    }\n    if (k == null) {\n        k = { test: 1 };\n    }\n};'));    
});

describe('splat in function declaration:', function () {
  it('func decl with splat',
    generateTest('func f(a...) {}', 
      'function f() {\n    var __splat, a = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];\n}'));
    
  it('func decl with splat, parameter',
    generateTest('func f(a..., b) {}', 
      'function f() {\n    var __splat, a = 2 <= arguments.length ? [].slice.call(arguments, 0, __splat = arguments.length - 1) : (__splat = 0, []), b = arguments[__splat++];\n}'));
    
  it('func decl with parameter, splat',
    generateTest('func f(a, b...) {}', 
      'function f() {\n    var __splat, a = arguments[0], b = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];\n}'));
    
  it('func decl with parameter, splat, parameter',
    generateTest('func f(a, b..., c) {}', 
      'function f() {\n    var __splat, a = arguments[0], b = 3 <= arguments.length ? [].slice.call(arguments, 1, __splat = arguments.length - 1) : (__splat = 1, []), c = arguments[__splat++];\n}'));
    
  it('func decl with parameter, parameter, splat, parameter',
    generateTest('func f(a, b, c..., d) {}', 
      'function f() {\n    var __splat, a = arguments[0], b = arguments[1], c = 4 <= arguments.length ? [].slice.call(arguments, 2, __splat = arguments.length - 1) : (__splat = 2, []), d = arguments[__splat++];\n}'));
    
  it('func decl with parameter, splat, parameter, parameter',
    generateTest('func f(a, b..., c, d) {}', 
      'function f() {\n    var __splat, a = arguments[0], b = 4 <= arguments.length ? [].slice.call(arguments, 1, __splat = arguments.length - 2) : (__splat = 1, []), c = arguments[__splat++], d = arguments[__splat++];\n}'));    

  it('multiple splats in func decl',
    generateErrorTest('func f(a..., b...) {}', [{ type: "MultipleSplatsDisallowed" }]));
});

describe('splat in call expressions:', function () {
  it('call expression with a splat', 
    generateTest('f(a...);', 'f.apply(null, a);'));
    
  it('call expression with splat, argument',
    generateTest('f(a..., b);', 'f.apply(null, [].slice.call(a).concat([b]));'));
    
  it('call expression with argument, splat',
    generateTest('f(a, b...);', 'f.apply(null, [a].concat([].slice.call(b)));'));
    
  it('call expression with splat, argument, argument',
    generateTest('f(a..., b, c);', 'f.apply(null, [].slice.call(a).concat([b], [c]));'));
    
  it('call expression with argument, splat, argument',
    generateTest('f(a, b..., c);', 'f.apply(null, [a].concat([].slice.call(b), [c]));'));
    
  it('call expression with argument, argument, splat, argument',
    generateTest('f(a, b, c..., d);', 'f.apply(null, [\n    a,\n    b\n].concat([].slice.call(c), [d]));'));
    
  it('null check call expression with a splat', 
    generateTest('f?(a...);', 'if (typeof f === \"function\") {\n    f.apply(null, a);\n}'));

  it('null check call expression with splat, argument',
    generateTest('f?(a..., b);', 'if (typeof f === \"function\") {\n    f.apply(null, [].slice.call(a).concat([b]));\n}'));
    
  it('null check call expression with argument, splat',
    generateTest('f?(a, b...);', 'if (typeof f === \"function\") {\n    f.apply(null, [a].concat([].slice.call(b)));\n}'));
    
  it('null check call expression with splat, argument, argument',
    generateTest('f?(a..., b, c);', 'if (typeof f === \"function\") {\n    f.apply(null, [].slice.call(a).concat([b], [c]));\n}'));
    
  it('null check call expression with argument, splat, argument',
    generateTest('f?(a, b..., c);', 'if (typeof f === \"function\") {\n    f.apply(null, [a].concat([].slice.call(b), [c]));\n}'));
    
  it('null check call expression with argument, argument, splat, argument',
    generateTest('f?(a, b, c..., d);', 'if (typeof f === \"function\") {\n    f.apply(null, [\n        a,\n        b\n    ].concat([].slice.call(c), [d]));\n}'));
});

describe('conditional expressions:', function () {
  it('conditional expression',
    generateTest('var x = a() if b else c();', 'var x = b ? a() : c();'));
});

describe('for in statement:', function () {
  it('for in statement without index',
    generateTest('for item in array {}', 
      'array.forEach(function (item) {\n}, this);'));
    
  it('for in statement with index',
    generateTest('for item, index in array {}', 
      'array.forEach(function (item, index) {\n}, this);'));  
});

describe('for of statement:', function () {
  it('for of statement without value',
    generateTest('for key of object {}', 
      'Object.keys(object).forEach(function (key) {\n}, this);'));
    
  it('for of statement with value',
    generateTest('for key, value of object {}', 
      'Object.keys(object).forEach(function (key) {\n    var value = object[key];\n}, this);'));  
    
  it('for of statement of call expression without value',
    generateTest('for key of f() {}', 
      'Object.keys(f()).forEach(function (key) {\n}, this);'));
    
  it('for of statement of call expression  with value',
    generateTest('for key, value of f() {}', 
      'var forOf0 = f();\nObject.keys(forOf0).forEach(function (key) {\n    var value = forOf0[key];\n}, this);'));    
});

describe('try statement:', function () {
  it('try statement without handler with finalizer', 
    generateTest('try { a(); } finally { b(); }', 
      'try {\n    a();\n} finally {\n    b();\n}'));
      
  it('try statement with handler without finalizer', 
    generateTest('try { a(); } catch error { b(); }', 
      'try {\n    a();\n} catch (error) {\n    b();\n}'));
      
  it('try statement with handler and finalizer', 
    generateTest('try { a(); } catch error { b(); } finally { c(); }', 
      'try {\n    a();\n} catch (error) {\n    b();\n} finally {\n    c();\n}'));      
});

describe('in expression:', function () {
  it('in expression with identifier',
    generateTest('var x = a in b;',
      'var x = b instanceof Array ? b.indexOf(a) !== -1 : a in b;'));
      
  it('in expression with call expression',
    generateTest('var x = a in b();',
      'var inExpression0 = b();\nvar x = inExpression0 instanceof Array ? inExpression0.indexOf(a) !== -1 : a in inExpression0;'));
});

describe('list comprehensions:', function () {
  it('list comprehension without condition and without index', 
    generateTest('var x = [item + 1 for item in array];',
      'var x = function () {\n    var forIn0 = [];\n    array.forEach(function (item) {\n        forIn0.push(item + 1);\n    }, this);\n    return forIn0;\n}();'));
  
  it('list comprehension with condition and without index', 
    generateTest('var x = [item + 1 for item in array if condition];',
      'var x = function () {\n    var forIn0 = [];\n    array.forEach(function (item) {\n        if (condition) {\n            forIn0.push(item + 1);\n        }\n    }, this);\n    return forIn0;\n}();'));
      
  it('list comprehension without condition and with index', 
    generateTest('var x = [item + index for item, index in array];',
      'var x = function () {\n    var forIn0 = [];\n    array.forEach(function (item, index) {\n        forIn0.push(item + index);\n    }, this);\n    return forIn0;\n}();'));
 
 it('list comprehension with condition and with index', 
    generateTest('var x = [item + index for item, index in array if index > 1];',
      'var x = function () {\n    var forIn0 = [];\n    array.forEach(function (item, index) {\n        if (index > 1) {\n            forIn0.push(item + index);\n        }\n    }, this);\n    return forIn0;\n}();'));
});

describe('switch statement:', function () {
  it('switch statement with single case', 
    generateTest('switch n { case 1: { } }', 
      'if (n === 1) {\n}'));
      
  it('switch statement with 2 cases', 
    generateTest('switch n { case 1: { }, case 2: { } }', 
      'if (n === 1) {\n} else if (n === 2) {\n}'));
      
  it('switch statement with 2 cases with multiple options', 
    generateTest('switch n { case 1, 2: { }, case 3, 4: { } }', 
      'if (n === 1 || n === 2) {\n} else if (n === 3 || n === 4) {\n}'));
      
  it('switch statement with 2 cases with multiple options and default case', 
    generateTest('switch n { case 1, 2: { }, case 3, 4: { }, default: { } }', 
      'if (n === 1 || n === 2) {\n} else if (n === 3 || n === 4) {\n} else {\n}'));
        
  it('switch statement with 2 cases with multiple options, inclusive range case and default case', 
    generateTest('switch n { case 1, 2: { }, case 3, 4: { }, case 5..6: { }, default: { } }', 
      'if (n === 1 || n === 2) {\n} else if (n === 3 || n === 4) {\n} else if (n >= 5 && n <= 6) {\n} else {\n}'));
      
  it('switch statement with 2 cases with multiple options, inclusive range case without from and default case', 
    generateTest('switch n { case 1, 2: { }, case 3, 4: { }, case ..6: { }, default: { } }', 
      'if (n === 1 || n === 2) {\n} else if (n === 3 || n === 4) {\n} else if (n <= 6) {\n} else {\n}'));
      
  it('switch statement with 2 cases with multiple options, inclusive range case without to and default case', 
    generateTest('switch n { case 1, 2: { }, case 3, 4: { }, case 5..: { }, default: { } }', 
      'if (n === 1 || n === 2) {\n} else if (n === 3 || n === 4) {\n} else if (n >= 5) {\n} else {\n}'));
      
  it('switch statement with 2 cases with multiple options, exclusive range case and default case', 
    generateTest('switch n { case 1, 2: { }, case 3, 4: { }, case 5...6: { }, default: { } }', 
      'if (n === 1 || n === 2) {\n} else if (n === 3 || n === 4) {\n} else if (n >= 5 && n < 6) {\n} else {\n}')); 
      
  it('switch statement with 2 cases with multiple options, exclusive range case without from and default case', 
    generateTest('switch n { case 1, 2: { }, case 3, 4: { }, case ...6: { }, default: { } }', 
      'if (n === 1 || n === 2) {\n} else if (n === 3 || n === 4) {\n} else if (n < 6) {\n} else {\n}'));
      
  it('switch statement with 2 cases with multiple options, exclusive range case without to and default case', 
    generateTest('switch n { case 1, 2: { }, case 3, 4: { }, case 5...: { }, default: { } }', 
      'if (n === 1 || n === 2) {\n} else if (n === 3 || n === 4) {\n} else if (n >= 5) {\n} else {\n}'));
      
  it('switch statement with single default case', 
    generateErrorTest('switch ::n { default: { } }', 
      [{ "type": "SingleDefaultClause" }]));

  it('switch statement with range case without from and without to', 
    generateErrorTest('switch ::n { case ..: { } }', 
      [{ "type": "EmptyRange" }]));      
});