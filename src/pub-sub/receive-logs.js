const amqp = require('amqplib');

const logMessage = msg => {
  console.log(" [x] '%s'", msg.content.toString());
};

amqp
  .connect('amqp://localhost')
  .then(conn => {
    process.once('SIGINT', () => {
      conn.close();
    });
    return conn.createChannel().then(ch => {
      const ex = 'logs';
      let ok = ch.assertExchange(ex, 'fanout', { durable: false });
      ok = ok.then(() => {
        // 声明随机名称队列，exclusive参数为true表示当消费者断开队列连接时，此队列就会删除
        // 声明队列时不传入名称，就可以生成一个有随机名称的队列
        return ch.assertQueue('', { exclusive: true });
      });
      ok = ok.then(qok => {
        // 将队列和Exchange绑定在一起，bindQueue的第三个参数是路由配置
        // console.log('qok: ', qok);
        return ch.bindQueue(qok.queue, ex, '').then(() => {
          return qok.queue;
        });
      });
      ok = ok.then(queue => {
        // 开始消费队列中的数据
        return ch.consume(queue, logMessage, { noAck: true });
      });
      return ok.then(() => {
        console.log(' [*] Waiting for logs. To exit press CTRL+C');
      });
    });
  })
  .catch(console.warn);
