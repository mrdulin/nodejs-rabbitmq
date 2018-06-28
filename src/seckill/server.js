const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');
const { withoutRabbitmq, withRabbitmq } = require('./routes');

require('./db');
const startMQServer = require('./mq-server');
startMQServer();

const app = express();

app.use(bodyParser.json());

app.get('/normal', (req, res) => {
  res.send('normal');
});

app.use('/withoutRabbitmq', withoutRabbitmq);
app.use('/withRabbitmq', withRabbitmq);

app.listen(config.app.port, config.app.hostname, () => {
  console.log(`Server is started and listenning on http://${config.app.hostname}:${config.app.port}`);
});
