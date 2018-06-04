const amqp = require('amqplib');

const config = require('./config');

amqp
  // 连接本地的RabbitMQ队列，和服务器代码一样
  .connect(config.rabbitmqOptions)
  .then(conn => {
    return (
      conn
        .createChannel()
        .then(ch => {
          const q = 'connect-vhost-with-authentication';
          const msg = 'Hello World!';
          // 同样把通道绑定到hello队列，并设定持久化为false
          const ok = ch.assertQueue(q, { durable: false });
          // 向队列发送Buffer，发送完毕后关闭通道
          return ok.then(() => {
            ch.sendToQueue(q, Buffer.from(msg));
            console.log(" [x] Sent '%s'", msg);
            return ch.close();
          });
        })
        // 通道关闭后，把RabbitMQ的连接也关闭
        .finally(() => {
          conn.close();
        })
    );
  })
  .catch(console.warn);
