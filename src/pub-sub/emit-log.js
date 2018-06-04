const amqp = require('amqplib');

amqp
  .connect('amqp://localhost')
  .then(conn => {
    return conn
      .createChannel()
      .then(ch => {
        // 命名Exchange为logs
        const ex = 'logs';
        // 定义Exchange，命名为logs，类型为fanout，durable持久化队列为false
        const ok = ch.assertExchange(ex, 'fanout', { durable: false });

        const message = process.argv.slice(2).join(' ') || 'info: Hello World!';

        return ok.then(() => {
          // 将消息message推送给Exchange节点，其中publish函数的第二个参数为路由配置
          ch.publish(ex, '', Buffer.from(message));
          console.log(" [x] Sent '%s'", message);
          return ch.close();
        });
      })
      .finally(() => {
        conn.close();
      });
  })
  .catch(console.warn);
