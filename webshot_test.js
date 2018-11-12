var webshot = require('webshot');

//const url = 'twitter.com'
//const url = 'localhost:3001/read/-LQkIIxBut4pTynWptNk'
const url = 'https://coffeelux.club/fullscreen/-LQ4CHlZxypUsq0l-eRV'

const options = {
  takeShotOnCallback: false,
  errorIfJSException: true,
  errorIfStatusIsNot200: false,
  renderDelay: 5000,
  // onLoadFinished: { fn: function() {
  //   this.console.log(window.location.href)
  // }, context: {console} }
}
console.log(__dirname)
webshot(url, __dirname + '/bike2.png',options, function(err) {
  if(err)
    console.log(err);
});
