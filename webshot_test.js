var webshot = require('webshot');

//const url = 'twitter.com'
//const url = 'localhost:3001/read/-LQkIIxBut4pTynWptNk'
const url = 'https://149f6c95.ngrok.io/read/-LQkIIxBut4pTynWptNk'

const options = {
  takeShotOnCallback: false,
  errorIfJSException: true,
  errorIfStatusIsNot200: false,
  renderDelay: 5000,
  // onLoadFinished: { fn: function() {
  //   this.console.log(window.location.href)
  // }, context: {console} }
}
webshot(url, 'bike1.png',options, function(err) {
  if(err)
    console.log(err);
});
