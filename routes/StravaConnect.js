const Express = require('express');
const router = Express.Router();
const strava = require('strava-v3');



const log = res => 
  (err,payload,limits) => {
  if(!err) {
    console.log(payload);
    res.send(payload)
  }
  else {
    console.log(err);
    res.send(err)
  }
}

router.post('/', async (req, res) => {
  strava.athlete.get({}, log(res))
})
router.post('/oauth', async (req, res) => {
  const url = strava.oauth.getRequestAccessURL({scope:"view_private,write"})
  res.send(url)
})
router.post('/token', async (req, res) => {
  strava.oauth.getToken('38175f9ac64fd8a6fde60acc9c6737f0f739c82d', log(res))
})
router.post('/all', async (req, res) => {
  strava.athletes.get({id: 11272058}, log(res))
})

router.post('/followers', async (req, res) => {
  strava.athlete.listFollowers({}, log(res));
})
router.post('/friends', async (req, res) => {
  strava.athlete.listFriends({}, log(res));
})
router.post('/routes', async (req, res) => {
  strava.athlete.listRoutes({}, log(res));
})
router.post('/activities', async (req, res) => {
  strava.athlete.listActivities({}, log(res));
})
router.post('/leaderboard', async (req, res) => {
  strava.segments.listLeaderboard({id: 2698998}, log(res));
})
module.exports = { router };
