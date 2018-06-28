const amqp = require('amqplib');
const config = require('./config');

const Order = require('./models/Order');

async function insertDataToDb(ch, msg) {
  const jsonMsg = JSON.parse(msg.content);
  const data = Object.assign({}, jsonMsg, { date: Date.now() });
  let content;
  try {
    const count = await Order.count();
    console.log('order count: ', count);
    if (count < 100) {
      const order = await Order.create(data);
      content = '创建order成功!';
      ch.ack(msg);
    } else {
      content = '秒杀光了！';
      ch.ack(msg);
    }
  } catch (err) {
    console.log(err);
    content = '服务器内部错误!';
  }
  ch.sendToQueue(`${config.RABBITMQ.queue}-back`, Buffer.from(content));
}

async function startMQServer() {
  const q = `${config.RABBITMQ.queue}-send`;
  try {
    const conn = await amqp.connect(config.RABBITMQ.connection);
    const ch = await conn.createChannel();

    ch.prefetch(1);

    const assertQueue = await ch.assertQueue(q);

    console.log('[x] Wait for message');
    ch.consume(q, msg => insertDataToDb(ch, msg), { noAck: false });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = startMQServer;
