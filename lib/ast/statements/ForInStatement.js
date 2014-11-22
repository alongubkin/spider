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
    ForInStatement.prototype.codegen = function (every) {
        if (every == null) {
            every = true;
        }
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
        this.array = this.array.codegen();
        this.body = this.body.blockWrap().codegen();
        if (!!every && !!(!!(this.body.body.length === 0) || !!(this.body.body[this.body.body.length - 1].type !== "ReturnStatement"))) {
            this.body.body.push({
                "type": "ReturnStatement",
                "codeGenerated": true,
                "argument": {
                    "type": "Literal",
                    "value": true
                }
            });
        }
        this.type = "ExpressionStatement";
        this.expression = {
            "type": "CallExpression",
            "callee": {
                "type": "MemberExpression",
                "computed": false,
                "object": this.array,
                "property": {
                    "type": "Identifier",
                    "name": every ? "every" : "forEach"
                }
            },
            "arguments": [
                {
                    "type": "FunctionExpression",
                    "id": null,
                    "params": params,
                    "defaults": [],
                    "body": this.body,
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