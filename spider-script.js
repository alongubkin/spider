require("traceur");

var spider = require("./lib/spider");
for (var prop in spider) {
	exports[prop] = spider[prop];
}