const axios = require('axios');
const URL = 'http://localhost:8080/api/StravaConnect'
const t = async () => {
  const a = axios.post(URL + '/leaderboard')
  const b = axios.post(URL + '/')
  const [c, d] = await Promise.all([a,b])
  console.log(typeof c, typeof d)
  return [c.data,d.data]
}

const u = async () => {
  const [a,b] = await t()
  console.log(a)
  console.log('------------')
  console.log(b)
}

u()
