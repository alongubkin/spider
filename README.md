Spider  
===

[![NPM Version](http://img.shields.io/npm/v/spider-script.svg?style=flat)](https://www.npmjs.org/package/spider-script) [![Build Status](https://img.shields.io/travis/alongubkin/spider.svg?style=flat)](http://travis-ci.org/alongubkin/spider) [![Dependencies](http://img.shields.io/david/alongubkin/spider.svg?style=flat)](https://david-dm.org/alongubkin/spider) [![Test Coverage](http://img.shields.io/coveralls/alongubkin/spider.svg?style=flat)](https://coveralls.io/r/alongubkin/spider)

The Next-Gen Programming Language for the Web. 

> **Note:** Spider is still work in progress. Make sure to star the project if you are interested!

[Documentation](http://spiderlang.org/)

### Installation

    npm install -g spider-script
    
### Usage

Execute a script:

    spider /path/to/script.spider
    
Compile a script:

    spider -c /path/to/script.spider

### Join the Community

* Website: http://spiderlang.org 
* IRC: #spiderlang on Freenode
* Q/A: [spiderlang](http://stackoverflow.com/questions/tagged/spiderlang) tag in StackOverflow
* [Google Group](http://groups.google.com/d/forum/spiderlang?hl=en)

### Changelog

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
