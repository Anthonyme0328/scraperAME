var express = require('express');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-Parser');
var mongoose = require('mongoose');


var PORT = process.env.PORT || 3000;

var app = express();

var router= express.Router();

require('./config/routes')(router);

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars')


app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(router);

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI)

app.listen(PORT, function(){
  console.log('listening on port:' + PORT)
});