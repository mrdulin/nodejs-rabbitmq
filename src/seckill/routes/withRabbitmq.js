const { Router } = require('express');
const rp = require('request-promise');
const uuidv1 = require('uuid/v1');
const amqp = require('amqplib');

const config = require('../config');
const Order = require('../models/Order');

const router = Router();

let conn;
amqp.connect(config.RABBITMQ.connection).then(_conn => {
  conn = _conn;
});

router.get('/buy', async (req, res) => {
  const userId = uuidv1();
  const dataString = JSON.stringify({ userId });
  try {
    const ch = await conn.createChannel();
    const assertQueue = await ch.assertQueue(`${config.RABBITMQ.queue}-back`);

    // ch.consume(
    //   `${config.RABBITMQ.queue}-back`,
    //   msg => {
    //     res.send(msg.content.toString());
    //     // ch.close();
    //   },
    //   { noAck: true }
    // );

    ch.sendToQueue(`${config.RABBITMQ.queue}-send`, Buffer.from(dataString), {
      contentType: 'application/json'
    });
    console.log(' [x] Sent ', dataString);

    res.send('订单已提交');
  } catch (err) {
    console.log(err);
    res.send('服务器内部错误!');
  }
});

module.exports = router;
