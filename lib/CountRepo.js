const {db} = require('../firebase');

module.exports = class CountRepo {
  static async create(id, name, data){
    var key = id.length === 10 ? id : id.substring(0,10);
    let updates = {}
    const now = Date.now();
    updates['/counts/' + key] = { name, createdAt: now, updatedAt: now, data  };

    let result = { key, code: 200 }
    try {
      await db.ref().update(updates);
    } catch(err){
      console.log(err)
      result.code = 500
      result.error = err
    }
    return result
  }
  static async update(id, name, data){
    let key = id.substring(0,10);
    console.log(data)
    let updates = {}
    const user = CountRepo.createOrUpdateNewDay(key, 'coffee', data.coffee)
    if(user){
      user.updatedAt = Date.now();
      updates[`/counts/${key}`] = user;
      let result = { key, code: 200 }
      try {
        await db.ref().update(updates);
      } catch(err){
        console.log(err)
        result.code = 500
        result.error = err
      }
      return result
    } else CountRepo.create(key, name, data)
  }
  static async index(){
    const data = await CountRepo.rawIndex()
    return CountRepo.convertToArray(data)
  }
  static async read(id){
    let key = id.substring(0,10);
    let snapshot = await db.ref(`counts/${key}`).once('value')
      .catch(error => console.log(error));
    return snapshot.val()
  }
  static async rawIndex(){
    let snapshot = await db.ref('counts').once('value')
      .catch(error => console.log(error));
    return snapshot.val()
  }
  static convertToArray(data){
    return Object.entries(data).map( ([googleId, value])  => ({
      googleId,
      user: value
    }))
  }
  // Day 1 is 1/01/2019
  static createOrUpdateNewDay(id, countKey, countValue) {
    if(id.length !== 10)
      id = id.substring(0,10);
    const user = CountRepo.read(id)
    const d = new Date()
    const today = `${d.getMonth()+1}.${d.getDate()}.${d.getYear()-100}`

    if(user && user.data){
      if(user.data[today])
        user.data[today] = {...user.data[today], [countKey]: countValue }
      else
        user.data[today] = { [countKey]: countValue }
      return user
    }
    return false;
  }
}
