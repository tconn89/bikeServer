const Express = require('express');
const {db} = require('../firebase');
const router = Express.Router();

class Repo {
  static async create(name, coords){
    var newRideKey = db.ref().child('rides').push().key;
    // TODO Add validation
    let updates = {}
    updates['/rides/' + newRideKey] = { name, coords: {'0': coords} };
    await db.ref().update(updates);
    return {key:newRideKey}
  }
  static async update(key, coordsArray){
    let updates = {}
    const preCount = await Repo.coordsCount(key)
    console.log('PreCount', preCount)
    if(typeof coordsArray.length == 'number'){
      coordsArray.forEach((coord,i)=> {
        updates[`/rides/${key}/coords/${preCount+i}`] = coord;
      })
    }
    else
      return {error: 'coordinates must be an array', status: 400}
    await db.ref().update(updates);
    const count = await Repo.coordsCount(key)
    return {count}
  }
  static async index(){
    const rides = await Repo.rawIndex()
    return Repo.convertToArray(rides)
  }
  static async read(key){
    let snapshot = await db.ref(`rides/${key}`).once('value')
      .catch(error => console.log(error));
    return snapshot.val()
  }
  static async coordsCount(key){
    let snapshot = await db.ref(`rides/${key}/coords`).once('value')
      .catch(error => console.log(error));
      const tmp = snapshot.val()
      console.log('Snapshot', tmp)
      return Object.keys(tmp).length
  }
  static async rawIndex(){
    let snapshot = await db.ref('rides').once('value')
      .catch(error => console.log(error));
    return snapshot.val()
  }
  static convertToArray(rides){
    const map = Object.keys(rides).map( routeKey => {
      if(routeKey[0] == '-'){
        let coords = Object.keys(rides[routeKey]['coords']).map(coordKey => (rides[routeKey]['coords'][coordKey]) )
        return {name: rides[routeKey]['name'], coords, id: routeKey} 
      }
      return null
    })
    return map.filter(route => route != null)
  }
}

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
