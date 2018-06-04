const amqp = require('amqplib');
const { basename } = require('path');

// 从启动命令中获取一个需要绑定路由key的数组，比如我们的启动命令node receive-logs-direct.js error info，
// 这样变量severities就保存了['error', 'info']。如果没有任何路由key，则程序将打印提示信息并退出。
const severities = process.argv.slice(2);
if (severities.length < 1) {
  console.warn('Usage: %s [info] [warning] [error]', basename(process.argv[1]));
  process.exit(1);
}

function logMessage(msg) {
  console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
}

amqp
  .connect('amqp://localhost')
  .then(conn => {
    process.once('SIGINT', () => {
      conn.close();
    });
    return conn.createChannel().then(ch => {
      const ex = 'direct_logs';
      let ok = ch.assertExchange(ex, 'direct', { durable: false });

      ok = ok.then(() => {
        return ch.assertQueue('', { exclusive: true });
      });

      ok = ok.then(qok => {
        // 获取已经声明的队列对象queue
        const { queue } = qok;
        const bindQueuePromises = severities.map(sev => {
          return ch.bindQueue(queue, ex, sev);
        });
        return Promise.all(bindQueuePromises).then(() => {
          return queue;
        });
      });

      ok = ok.then(queue => {
        return ch.consume(queue, logMessage, { noAck: true });
      });
      return ok.then(() => {
        console.log(' [*] Waiting for logs. To exit press CTRL+C.');
      });
    });
  })
  .catch(console.warn);
