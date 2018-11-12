const Express = require('express');
const router = Express.Router();
const Repo = require('../lib/Repo')

router.get('/read/:key', async (req, res) => {
  console.log(req.params)
  if(req.params.key == undefined)
    return res.status(400).send({error: 'key must be defined'})
  let result = await Repo.read(req.params.key)
  res.send({result})
})

router.get('/index', async (req, res) => {
  console.log('Indexing Bike Routes')
  const result = await Repo.index()
  res.send({result})
})

router.post('/create', async (req, res) => {
  const {name, coords } = req.body.route
  console.log('create ' + name)
  const {key} = await Repo.create(name, coords)
  res.send({key})
})
router.post('/', async (req, res) => {
  const { key, ride } = req.body
  console.log(`Updating ${key}`)
  const {count, error} = await Repo.update(key, ride)
  res.send({count, error})
})

module.exports = {router };
