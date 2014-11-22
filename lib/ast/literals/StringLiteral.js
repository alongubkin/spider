"use strict";
(function () {
    var Node = require("../Node").Node;
    function StringLiteral(chars) {
        Node.call(this);
        this.type = "StringLiteral";
        this.chars = chars;
    }
    StringLiteral.prototype = Object.create(Node);
    StringLiteral.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        var elements = [];
        this.chars.every(function (value) {
            if ((typeof value === "undefined" ? "undefined" : {}.toString.call(value).match(/\s([a-zA-Z]+)/)[1].toLowerCase()) === "string") {
                var lastElement = elements[elements.length - 1];
                if ((typeof lastElement !== "undefined" && lastElement !== null ? lastElement.type : void 0) === "Literal") {
                    lastElement.value += value;
                } else {
                    elements.push({
                        type: "Literal",
                        value: value
                    });
                }
            } else {
                value.parent = this;
                elements.push(value.codegen());
            }
            return true;
        }, this);
        if (elements.length === 0) {
            return {
                "type": "Literal",
                "value": ""
            };
        } else {
            if (elements.length === 1) {
                return elements[0];
            }
        }
        var reduced = elements.reduce(function (left, right) {
            return {
                type: "BinaryExpression",
                operator: "+",
                left: left,
                right: right
            };
        });
        this.type = reduced.type;
        this.operator = reduced.operator;
        this.left = reduced.left;
        this.right = reduced.right;
        return this;
    };
    StringLiteral.prototype.hasCallExpression = function () {
        return false;
    };
    exports.StringLiteral = StringLiteral;
}());

//# sourceMappingURL=lib/ast/literals/StringLiteral.map