const {db} = require('../firebase');

const LAT_TO_KILOMETER = 110.574;
const LNG_TO_KILOMETER = 111.32;
const DEGREE_TO_RADIAN = 0.01745

module.exports = class Repo {
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
        return {
          name: rides[routeKey]['name'],
          hasThumb: rides[routeKey]['hasImage'],
          totalDistance: rides[routeKey]['totalDistance'],
          coords, id: routeKey, 
        } 
      }
      return null
    })
    return map.filter(route => route != null)
  }
  static async updateImageMeta(keys){
    let updates = {} 
    keys.forEach(key => {
      if(key.length != 20)
        return
      updates[`/rides/${key}/hasImage`] = true
    })
    await db.ref().update(updates);
    return {}
  }

  static async updateTotalMiles(keys){
    let updates = {} 
    const rides = await Repo.index()
    rides.forEach((ride , i) =>{
      if(rides.totalDistance)
        return
      // get distance between current point and last point
      let distance = []
      const exp = Math.pow
      const sqrt = Math.sqrt
      ride.coords.forEach((coord, k) => {
        if(k === 0) return
        const prevCoord = ride.coords[k - 1]
        const radians = (prevCoord.heading !== undefined ? prevCoord.heading: coord.heading) * DEGREE_TO_RADIAN
        const latDiff = (coord.lat - prevCoord.lat) * LAT_TO_KILOMETER;
        const lngDiff = (coord.lng - prevCoord.lng) * LNG_TO_KILOMETER * Math.cos(radians);
        distance.push(sqrt(exp(latDiff,2) + exp(lngDiff,2)))
      })
      updates[`rides/${ride.id}/totalDistance`] = distance.reduce((cum, sum) => cum + sum)
    })

    await db.ref().update(updates);
    return {}
  }
}
