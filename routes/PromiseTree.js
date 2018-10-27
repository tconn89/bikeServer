var Promise = require('bluebird');
const Express = require('express');
const PromiseTree = require('../lib/PromiseTree');

const PORT = process.env.PORT || 4000
const router = Express.Router();

class ExtendedPromiseTree extends PromiseTree {
  constructor(data){
    super(data)
    this.result = []
  }

  log(node){
    this.result.push(node.value)
  }
  async traverseRight(node){
    if(node.right > 0){
      let rightNode = await this.getNode(node.right)
      await this.traverse(rightNode)
    }
  }
  async traverse(node){
    if(node.left > 0){
      let leftChild = await this.getNode(node.left)
      await this.traverse(leftChild)
    }
    this.log(node)
    await this.traverseRight(node)
    return this.result
  }
}

router.post('/', async (req, res) => {
  let tree = new ExtendedPromiseTree(req.body)
  let root = await tree.getRoot()
  let result = await tree.traverse(root)
  res.send(result)
})

module.exports = { ExtendedPromiseTree, router};
