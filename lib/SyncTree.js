function SyncTree(data) {
    if (!Array.isArray(data)) {
        throw new Error('The data must be an Array');
    }
    this.data = data;
};

SyncTree.prototype.getRoot = function () {
    return this.data[0];
};

SyncTree.prototype.getNode = function (index) {
    return this.data[index];
};

module.exports = SyncTree;
