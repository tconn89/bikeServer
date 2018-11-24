const Express = require('express');
const router = Express.Router();
const Repo = require('../lib/Repo');

router.post('/update/totalMiles', async (req, res) => {
  const keys = ['-LRD-Rbb2juPXlQiA5MQ']
  const {error} = await Repo.updateTotalMiles(keys)
  res.send(error ? {error} : {})
})
module.exports = { router };
