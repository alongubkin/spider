"use strict";
(function () {
    var Node = require("../Node").Node;
    function ForInStatement(item, index, array, body) {
        Node.call(this);
        this.type = "ForInStatement";
        this.item = item;
        this.item.parent = this;
        this.index = index;
        if (typeof this.index !== "undefined" && this.index !== null) {
            this.index.parent = this;
        }
        this.array = array;
        this.array.parent = this;
        this.body = body;
        this.body.parent = this;
    }
    ForInStatement.prototype = Object.create(Node);
    ForInStatement.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        this.item = this.item.codegen(false);
        var params = [this.item];
        this.defineIdentifier(this.item);
        if (typeof this.index !== "undefined" && this.index !== null) {
            this.index = this.index.codegen(false);
            params.push(this.index);
            this.defineIdentifier(this.index);
        }
        this.type = "ExpressionStatement";
        this.expression = {
            "type": "CallExpression",
            "callee": {
                "type": "MemberExpression",
                "computed": false,
                "object": this.array.codegen(),
                "property": {
                    "type": "Identifier",
                    "name": "forEach"
                }
            },
            "arguments": [
                {
                    "type": "FunctionExpression",
                    "id": null,
                    "params": params,
                    "defaults": [],
                    "body": this.body.blockWrap().codegen(),
                    "rest": null,
                    "generator": false,
                    "expression": false
                },
                { "type": "ThisExpression" }
            ]
        };
        return this;
    };
    exports.ForInStatement = ForInStatement;
}());

//# sourceMappingURL=lib/ast/statements/ForInStatement.map