const result = require('dotenv').config()
if(result.error)
  throw result.error
const Express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const { router: CaptureRideRoutes } = require('./routes/CaptureRides');
const { router: ThumbnailManager } = require('./routes/ThumbnailManager');
const { router: SumMilesWorker } = require('./routes/SumTotalWorker');

const PORT = process.env.PORT || 4000
const app = Express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(Express.static('public'))
app.use(cors())
app.use('/api/CaptureRides', CaptureRideRoutes);
app.use('/job/Thumbnail', ThumbnailManager);
app.use('/job/SumMiles', SumMilesWorker);

app.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

app.get('/test', (req, res) => {
  console.log('Hello World')
  res.send('Sanity Check Passed')
})

app.get('/*', function (req, res) {
   res.sendFile(path.join(__dirname, 'public', 'index.html'));
 });

app.listen(PORT, function () {
  console.log("Rockin out on port " + PORT + " homie");
});

// 404
app.use(function(req, res, next){
  res.status(404);

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text
  res.type('txt').send('Not found');
});
