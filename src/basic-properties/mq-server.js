const amqp = require('amqplib');

const cloudamqpConfig = require('../cloudamqp/config');
const localConfig = require('./config');

function onMessage(msg) {
  console.log('msg: ', msg);
  console.log('msg string: ', msg.content.toString());
  console.log('json parse msg.content: ', JSON.parse(msg.content));
}

async function main() {
  try {
    const conn = await amqp.connect(cloudamqpConfig.connection);
    const ch = await conn.createChannel();
    const assertQueue = await ch.assertQueue(localConfig.queue);
    console.log(' [x] wait for message..');

    const consume = await ch.consume(localConfig.queue, onMessage, { noAck: true });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

main()
  .then(() => {
    console.log('mq-server启动成功');
  })
  .catch(err => {
    console.log('出错啦！');
  });
