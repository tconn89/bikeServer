const webshot = require('webshot');
const axios = require('axios');

const PORT = 8080
const IMAGE_DIR = '/var/www/bikedash/public/img/thumbs'

const main = async () => {
const {data} = await axios.get(`http://localhost:${PORT}/api/captureRides/index`)
const arr = data.result.filter(elem => !elem.hasThumbnail).map(elem => ({id: elem.id}))
//const url = 'twitter.com'
//const url = 'localhost:3001/read/-LQkIIxBut4pTynWptNk'
const thumbNailWorker = id => {
  const url = 'https://coffeelux.club/fullscreen/' + id

  const options = {
    takeShotOnCallback: false,
    errorIfJSException: true,
    errorIfStatusIsNot200: false,
    windowSize: { width: 740, height: 420},
    renderDelay: 5000,
  }
  webshot(url, IMAGE_DIR + '/' + id.slice(1) + '.png',options, function(err) {
    if(err)
      return console.log(err);
    console.log('Wrote: ', id)
  });
}

arr.forEach(async route => {
  thumbNailWorker(route.id)
})
}
main()
