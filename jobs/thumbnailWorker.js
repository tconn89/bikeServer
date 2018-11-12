const webshot = require('webshot');
const axios = require('axios');

const PORT = 8080
const IMAGE_DIR = '/var/www/bikedash/public/img'

const main = async () => {
const {data} = await axios.get(`http://localhost:${PORT}/api/captureRides/index`)
const arr = data.result.map(elem => ({id: elem.id, hasThumbnail: false}))
//const url = 'twitter.com'
//const url = 'localhost:3001/read/-LQkIIxBut4pTynWptNk'
const thumbNailWorker = async id => {
  const url = 'https://coffeelux.club/fullscreen/' + id

  const options = {
    takeShotOnCallback: false,
    errorIfJSException: true,
    errorIfStatusIsNot200: false,
    windowSize: { width: 740, height: 420},
    renderDelay: 4000,
  }
  await webshot(url, IMAGE_DIR + '/' + id.slice(1) + '.png',options, function(err) {
    if(err)
      console.log(err);
  });
}

arr.forEach(async route => {
  await thumbNailWorker(route.id)
  console.log('Wrote: ', route.id)
})
}
main()
