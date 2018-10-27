var Promise = require('bluebird');

function PromiseTree(data) {
    if (!Array.isArray(data)) {
        throw new Error('The data must be an Array');
    }
    this.data = data;
};

PromiseTree.prototype.getRoot = function (callback) {
   return Promise.resolve(this.data[0]);
};

PromiseTree.prototype.getNode = function (index, callback) {
    return Promise.resolve(this.data[index]);
};

module.exports = PromiseTree;
