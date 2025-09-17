const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

const userAuthRoute = require('./routes/userAuth.route');

app.use('/api/user',userAuthRoute);


module.exports = app;