'use strict';
const express = require('express');
const app = express();
const getBuildStatuses = require('./lib/codeship-client');

app.use(express.static('public'));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/statuses', async function(req, res, next) {
  try {
    const statuses = await getBuildStatuses();
    res.json(statuses);
  }
  catch (error) {
    next(error);
  }
});

app.use(function(error, req, res, next) {
  console.log(error);

  if (typeof error.response === object) {
    res.status(error.response.status).json({ error: error.message });
  }
  else {
    res.status(500).json({ error: 'server error' });
  }

});

app.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}!`));
