### Changelog

2014 11 29 - **v0.1.3-alpha**

 * Separate a lot of CLI logic to lib/spider
 * Default behaviour for CLI
 * Refactor `spider.compile` API
 * Fix source map path bug with ES5 target
 * Fix "System is not defined" error when using Spider API

2014 11 29 - **v0.1.2-alpha**

 * CLI bug fixes
 
2014 11 27 - **v0.1.1-alpha**

 * [Async/Await](http://spiderlang.org/#async)
 * [Channels](http://spiderlang.org/#channels)
 * Add undefined keyword
 * Fix an undefined bug with destructing patterns
 * Fix CLI execute and remove dependency on vm2
 
2014 11 26 - **v0.1.0-alpha**

 * Add a `--target=ES5|ES6` flag (ES5 target uses [Traceur Compiler](https://github.com/google/traceur-compiler))
 * Change `func` keyword to `fn`
 * [ES6 Import/Export support](http://spiderlang.org/#modules)
 * [Curried Functions](http://spiderlang.org/#functions-curried-functions)
 * [Destructring Assignments](http://spiderlang.org/#destructuring)
 * [Object Initializer Shorthand](http://spiderlang.org/#shorthand-property-names)
 * [Property Method Assignments](http://spiderlang.org/#shorthand-method-names)
 * [Multi-line Strings](http://spiderlang.org/#strings-multi-line-strings)
 * [Pattern Matching](http://spiderlang.org/#switch-pattern-matching)
 * [Do-While Loop](http://spiderlang.org/#do-while-statement)
 * Delete Statement
 * Add JavaScript core global identifiers to defined identifiers
 * Add `__dirname` and `__filename` to `use :node`
 * Remove ES6 polyfills (Traceur is now responsible for that)
 * Fix CLI execute script
 * Fix source maps for function expressions

2014 11 22 - **v0.0.7-alpha**

 * Fat Arrow (`=>`) Function Expressions
 * `not` keyword
 * Fix `break` and `return` statements inside `for-in` and `for-of` statements
 * Disable source map generation option in CLI
 * Fix CLI execute script
 * Comma is now optional between switch case clauses
 * Regular Expression Literals

2014 11 20 - **v0.0.6-alpha**

 * Fallthrough Statement
 * Fix line endings

2014 11 20 - **v0.0.5-alpha**

 * Spider is now [self-hosted](http://en.wikipedia.org/wiki/Self-hosting)
 * Parenthesis in `while` and `until` statements are now optional
 * Massive parsing performance improvements
 * Fix "use strict" in compiled JS
 * Add `setTimeout` to `use :node` and `use :browser`
 * Optimize `!!!` to `!` in compiled JS