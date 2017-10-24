/* eslint no-console: off */

const http = require('http');
const path = require('path');
const express = require('express');
const compression = require('compression');

const app = express();
app.set('port', process.env.PORT);

app.use(compression({
  threshold: 128,
}));

app.use(express.static(path.join(__dirname, './build'), {
  etag: false,
  maxAge: '30 days',
}));

app.use((request, response) => {
  response.sendFile(path.join(__dirname, './build/index.html'));
});

const server = http.createServer(app); // creating server which express will piggy back on
server.listen(app.get('port'), '0.0.0.0', () => {
  console.log(`Server running on 0.0.0.0:${app.get('port')}...`);
});
