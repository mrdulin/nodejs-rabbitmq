import express from 'express';
import bodyParser from 'body-parser';

const RETRY_THRESHOLD = 10;
let retryTimes = 0;

function createServer() {
  const app = express();
  const port = 3000;

  app.use(bodyParser.json());
  app.get('/', (req, res) => {
    res.send('normal');
  });

  app.post('/create-user', (req, res) => {
    console.log('body: ', req.body);
    retryTimes += 1;
    if (retryTimes < RETRY_THRESHOLD) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });

  return app.listen(port, () => {
    console.log(`Http server is listening on http://localhost:${port}`);
  });
}

if (require.main === module) {
  createServer();
}
