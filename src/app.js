const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

var max = 5;
var counter = 0;
const OTPAuth = require('otpauth');
let totp = new OTPAuth.TOTP({
  digits: 6,
  period: 30,
  secret: process.env.code,
});


app.get('/', (req, res) => {
  if (counter >= max) {
    res.json({
      message: "Max requests reached",
    });
  } else {
    counter++;
  }

  res.json({
    message: totp.generate(),
  });
});

app.get('/reset', (req, res) => {
  counter=0;
  res.json({
    message: "reset OK",
  });
});
app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
