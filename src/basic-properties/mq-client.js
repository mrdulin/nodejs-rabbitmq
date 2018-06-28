const amqp = require('amqplib');

const cloudamqpConfig = require('../cloudamqp/config');
const localConfig = require('./config');

async function main() {
  const testData = {
    name: 'mrdulin',
    age: 23
  };
  try {
    const conn = await amqp.connect(cloudamqpConfig.connection);
    const ch = await conn.createChannel();
    const assertQueue = await ch.assertQueue(localConfig.queue);

    ch.sendToQueue(localConfig.queue, Buffer.from(JSON.stringify(testData)), {
      contentType: 'application/json',
      contentEncoding: 'gzip'
    });

    await ch.close();
    await conn.close();
  } catch (err) {
    console.log(err);
    throw err;
  }
}

main()
  .then(() => {
    console.log('mq-client消息发送成功');
  })
  .catch(err => {
    console.log('出错啦！');
  });
