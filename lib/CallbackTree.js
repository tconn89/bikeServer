function CallbackTree(data) {
    if (!Array.isArray(data)) {
        throw new Error('The data must be an Array');
    }
    this.data = data;
};

function inconsistentCallback(value, callback) {
    if (Math.random() > 0.5) {
        setImmediate(function () {
            callback(null, value);
        });
    } else {
        callback(null, value);
    }
    
}

CallbackTree.prototype.getRoot = function (callback) {
    inconsistentCallback(this.data[0], callback);
};

CallbackTree.prototype.getNode = function (index, callback) {
    inconsistentCallback(this.data[index], callback);
};

module.exports = CallbackTree;
