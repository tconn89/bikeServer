const Express = require('express');
const SyncTree = require('../lib/SyncTree');

const PORT = process.env.PORT || 4000
const router = Express.Router();

class ExtendedSyncTree extends SyncTree {
  constructor(data){
    super(data)
    this.result = []
  }

  log(node){
    this.result.push(node.value)
  }
  traverseRight(node){
    if(node.right > 0){
      let rightNode = this.getNode(node.right)
      this.traverse(rightNode)
    }
  }
  traverse(node){
    if(node.left > 0){
      let leftChild = this.getNode(node.left)
      this.traverse(leftChild)
      this.log(node)
      this.traverseRight(node)
    }
    else {
      this.log(node)
      this.traverseRight(node)
    }
    return this.result
  }
}

router.post('/', (req, res) => {
  let tree = new ExtendedSyncTree(req.body),
      root = tree.getRoot(),
      result = tree.traverse(root);
  res.send(result)

})

module.exports = { ExtendedSyncTree, router };
