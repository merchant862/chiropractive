require('dotenv').config();

//-------------------------------------------

let express = require('express');
let app = express();
let router = require('../routes/routes.js');
let { xPoweredByHeaders, serverHeaders } = require('../utils/responseHeaders.js');

//-------------------------------------------

let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');


app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

//-------------------------------------------

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', express.static('public'));

//--------------------------------------------

app.use(cors({ credentials: true, origin: true }))

app.use(serverHeaders);
app.use(xPoweredByHeaders);

app.use('/', router);

app.use(function(req, res, next) { res.status(404).redirect('/404') });

app.use(function(err, req, res, next) 
{
  console.error(err);
  res.status(500).redirect('/500');
});

//--------------------------------------------

module.exports = app;
