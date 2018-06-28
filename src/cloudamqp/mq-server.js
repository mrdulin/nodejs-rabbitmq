const amqp = require('amqplib');

const config = require('./config');

function onMessage(msg) {
  console.log('msg: ', msg.content.toString());
}

function quit() {
  process.exit(1);
}

async function main() {
  try {
    const conn = await amqp.connect(config.connection);
    const ch = await conn.createChannel();
    const assertQueue = await ch.assertQueue(config.quene);

    // 用于测试try/catch
    // const assertQueue = await ch.assertQueue({});

    console.log('assertQueue: ', assertQueue);
    console.log(' [*] Waiting for messages. To exit press CTRL+C');
    const consume = await ch.consume(config.quene, onMessage, { noAck: true });
    console.log('consume: ', consume);
  } catch (err) {
    // 打印错误信息及堆栈，用于开发者定位错误，排除错误
    console.log(err);
    // 将错误向上层代码抛出，以便上层代码捕获，上层代码指main函数
    throw err;
  }
}

main()
  .then(() => {
    console.log('mq-server启动成功!');
  })
  .catch(err => {
    //给用户的错误提示，用户只需要知道出错了，不需要知道错误的具体细节
    console.log('mq-server 出错啦!');
    quit();
  });
