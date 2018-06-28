const amqp = require('amqplib');

const config = require('./config');

async function main() {
  const msg = 'This is a message';
  try {
    const conn = await amqp.connect(config.connection);
    const ch = await conn.createChannel();
    const assertQueue = await ch.assertQueue(config.quene);

    ch.sendToQueue(config.quene, Buffer.from(msg));
    console.log(" [x] Sent '%s'", msg);

    await ch.close();
    await conn.close();
  } catch (err) {
    console.log(err);
    throw err;
  }
}

main()
  .then(() => {
    console.log('mq-client发送消息成功!');
  })
  .catch(err => {
    console.log('mq-client出错啦!');
  });
