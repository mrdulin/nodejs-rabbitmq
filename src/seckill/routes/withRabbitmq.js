const { Router } = require('express');
const rp = require('request-promise');
const uuidv1 = require('uuid/v1');
const amqp = require('amqplib');

const config = require('../config');
const Order = require('../models/Order');

const router = Router();

const q1 = `${config.RABBITMQ.queue}-back`;
const q2 = `${config.RABBITMQ.queue}-send`;

let conn;
amqp.connect(config.RABBITMQ.connection).then(_conn => {
  conn = _conn;
});

router.get('/buy', async (req, res) => {
  const userId = uuidv1();
  const dataString = JSON.stringify({ userId });
  try {
    const ch = await conn.createChannel();
    const assertQueue = await ch.assertQueue(q1);

    ch.sendToQueue(q2, Buffer.from(dataString), {
      contentType: 'application/json',
      correlationId: userId,
      replyTo: q1
    });
    console.log(' [x] Sent ', dataString);

    ch.consume(
      q1,
      msg => {
        res.send(msg.content.toString());
        ch.close();
      },
      { noAck: true }
    );
  } catch (err) {
    console.log(err);
    res.send('服务器内部错误!');
  }
});

module.exports = router;
