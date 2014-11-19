"use strict";
(function () {
    function Node() {
        var self = this;
        self.codeGenerated = false;
        self.definedIdentifiers = [];
        Object.defineProperty(self, "parent", {
            value: null,
            writable: true,
            configurable: true,
            enumerable: false
        });
        self.getContext = function () {
            if (!!(self.type === "Program") || !!(self.type === "BlockStatement")) {
                return {
                    node: self,
                    position: -1
                };
            }
            if (!(typeof self.parent !== "undefined" && self.parent !== null)) {
                return null;
            }
            var context = self.parent.getContext();
            if (!(typeof context !== "undefined" && context !== null)) {
                return null;
            }
            if (context.position === -1) {
                return {
                    node: context.node,
                    position: context.node.body.indexOf(self)
                };
            } else {
                return context;
            }
        };
        self.defineIdentifier = function (identifier) {
            self.definedIdentifiers.push(identifier);
        };
        self.isIdentifierDefined = function (name) {
            var defined = false;
            self.definedIdentifiers.forEach(function (identifier) {
                if (identifier.name === name) {
                    defined = true;
                }
            }, this);
            return !!defined || !!(!!self.parent && !!self.parent.isIdentifierDefined(name));
        };
        self.getDefinedIdentifier = function (name) {
            var id;
            self.definedIdentifiers.forEach(function (identifier) {
                if (identifier.name === name) {
                    id = identifier;
                }
            }, this);
            return typeof id === "undefined" || id === null ? self.parent ? self.parent.getDefinedIdentifier(name) : null : id;
        };
        self.blockWrap = function () {
            if (self.type === "BlockStatement") {
                return self;
            }
            var myParent = self.parent;
            var blockStatement = require("./statements/BlockStatement");
            var block = new blockStatement.BlockStatement([self]);
            block.parent = myParent;
            return block;
        };
    }
    Node.prototype.codegen = function () {
        if (this.codeGenerated) {
            return false;
        }
        this.codeGenerated = true;
        return true;
    };
    Node.setErrorManager = function (errorManager) {
        this.errorManager = errorManager;
    };
    Node.getErrorManager = function () {
        return this.errorManager;
    };
    exports.Node = Node;
}());

//# sourceMappingURL=lib/ast/Node.map