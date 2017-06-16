var express = require('express');
var path = require('path');
var app = express();
var cors = require('cors');

// var corsOptions = {
//   origin: 'http://192.168.20.9:5300/',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
var corsOptions = {
  origin: true,
  methods: ['GET'],
  credentials: true,
  maxAge: 3600,
  enablePreflight: true
};

app.use(cors(corsOptions));

// Define the port to run on
app.set('port', 5302);

app.use(express.static(path.join(__dirname, 'public')));

// Listen for requests
var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log('Servicio de Token Generador en el puerto ' + port);
});