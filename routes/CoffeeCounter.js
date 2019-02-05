const Express = require('express');
const router = Express.Router();
const { Repo, formatTime } = require('../lib/CountRepo')

router.post('/save', async (req, res) => {
  const { googleId, name, data } = req.body
  console.log(`Updating ${name}`)
  const result = await Repo.update(googleId, name, data)
  return res.send(result)
})
router.post('/load', async (req, res) => {
  console.log(req.body)
  if(req.body.googleId == undefined)
    return res.status(400).send({error: 'googleId must be defined'})
  let result = await Repo.read(req.body.googleId)
  return res.send({result: result.data[formatTime()]})
})

router.post('/create', async (req, res) => {
  const {googleId, name, data } = req.body.route
  console.log('Create count for ' + name)
  const result = await Repo.create(googleId, name, data)
  return res.send(result)
})

router.get('/index', async (req, res) => {
  console.log('Indexing All Count')
  const result = await Repo.index()
  return res.send({result})
})

router.all('/', async (req, res) => {
  console.log('Someone is poking around')
  return res.send({message: 'Hello! Thanks for the interest in CoffeeLux.  Reach out to @neuronswarm to learn more'})
})

module.exports = {router };
