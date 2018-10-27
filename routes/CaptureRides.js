const Express = require('express');
const {db} = require('../firebase');
const router = Express.Router();

class Repo {
  create(name, coords){
    var newRideKey = db.ref().child('rides').push().key;
    // TODO Add validation
    let updates = {}
    updates['/rides/' + newRideKey] = { name, coords: {'0': coords} };
    await db.ref().update(updates);
    return {}
  }
  update(key, coordsArray){
    let updates = {}
    if(typeof coordsArray.length == 'number'){
      coordsArray.forEach((coord,i)=> {
        updates['/rides/' + key + '/coords'] = { [i]: coord };
      })
    }
    else
      return {error: 'coordinates must be an array', status: 400}
    await db.ref().update(updates);
    return {}
  }
  rawIndex(){
    let snapshot = await db.ref('rides').once('value')
      .catch(error => console.log(error));
    return snapshot.val()
  }
  convertToArray(){
    return Object.keys(rides).map( routeKey => {
      if(routeKey[0] == '-'){
        let coords = Object.keys(rides[routeKey]['coords']).map(coordKey => (rides[routeKey]['coords'][coordKey]) )
        return {name: rides[routeKey]['name'], coords, id: routeKey} 
      }
      return null
    })
  }
}

router.get('/', async (req, res) => {
  let t = await db.ref('rides').child(1).once('value')
    .catch(error => console.log(error));
  res.send({result: t})
})

router.get('/index', async (req, res) => {
  console.log('Indexing Bike Routes')
  let snapshot = await db.ref('rides').once('value')
    .catch(error => console.log(error));
  let rides = snapshot.val()

  let result;
  let errors = []
  try {
  result = Object.keys(rides).map( routeKey => {
    if(routeKey[0] == '-'){
      let coords = Object.keys(rides[routeKey]['coords']).map(coordKey => (rides[routeKey]['coords'][coordKey]) )
      return {name: rides[routeKey]['name'], coords, id: routeKey} 
    }
    return null
  })
  result = result.filter(route => route != null)
} catch(error){console.log(error); errors.push(error)}
  
  res.send({result, errors})
})

router.post('/create', async (req, res) => {
  console.log(req.body)
  const {name, coords } = req.body.route
  console.log('create ' + name)
  var newRideKey = db.ref().child('rides').push().key;
  // TODO Add validation
  let updates = {}
  updates['/rides/' + newRideKey] = { name, coords: [] };
  await db.ref().update(updates);
  await db.ref(`rides/${newRideKey}`).child('coords').push(coords)
  res.send({key: newRideKey})
})
router.post('/', async (req, res) => {
  const { key, ride } = req.body
  console.log(`Updating ${key}`)

  if(typeof ride.length == 'number')
    ride.forEach(async location =>
      await db.ref(`rides/${key}`).child('coords').push(location)
        .catch(error => console.log(error))
    );
  else
    await db.ref(`rides/${key}`).child('coords').push(ride)
      .catch(error => console.log(error));
  let coords = await db.ref(`rides/${key}`).once('value')
  let val = await coords.val()
  res.send({count: Object.keys(val.coords).length})
})

module.exports = {router };
