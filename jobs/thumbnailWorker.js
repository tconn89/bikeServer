const webshot = require('webshot');
const axios = require('axios');
const async = require('async')

const PORT = 8080
const IMAGE_DIR = '/var/www/bikedash/public/img/thumbs'
var index = 0

const main = async () => {
const {data} = await axios.get(`http://localhost:${PORT}/api/captureRides/index`)
const arr = data.result.filter(elem => !elem.hasThumbnail).map(elem => ({id: elem.id}))

const thumbNailWorker = async (id, next) => {
  const url = 'https://coffeelux.club/fullscreen/' + id

  const options = {
    takeShotOnCallback: false,
    errorIfJSException: true,
    errorIfStatusIsNot200: false,
    windowSize: { width: 740, height: 420},
    renderDelay: 6000,
  }
  return new Promise((resolve, reject) => {
	  webshot(url, IMAGE_DIR + '/' + id.slice(1) + '.png',options, function(err) {
	    if(err)
	      return console.log(err);
	    console.log('Wrote: ', id)
	    resolve()
	    next()
	  });
  })
}

async.eachSeries(arr, function(route, next){
    thumbNailWorker(route.id, next)
}, function(){console.log('Done');})

}
main()

