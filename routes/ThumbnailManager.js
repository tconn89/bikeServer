const Express = require('express');
const router = Express.Router();
const Repo = require('../lib/Repo');
const fs = require('fs');

//const IMG_DIR = '/var/www/bikedash/public/img'
const IMG_DIR = '/Users/tyconnors/Workspace/CrossCityRacing/dashboard/public/img'
router.post('/update/meta', async (req, res) => {
  const list = req.body.ids
  const getIds = (list) => {
    if(list)
      return list
    else {
      return fs.readdirSync(IMG_DIR).map(id => '-' + id.substr(0, id.length-4))
    }
  }
  const ids = getIds(list)
  console.log(ids)

  const {error} = await Repo.updateImageMeta(ids)
  res.send(error ? {error} : {})
})
module.exports = { router };
