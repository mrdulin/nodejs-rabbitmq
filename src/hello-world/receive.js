const amqp = require('amqplib');

amqp
  // 连接本地的RabbitMQ队列服务器
  .connect('amqp://localhost')
  .then(conn => {
    // 接收CTRL+C的退出信号，关闭和RabbitMQ的连接
    process.once('SIGINT', () => {
      conn.close();
    });
    // conn.createChannel()表示创建一个通道
    return conn.createChannel().then(ch => {
      // 通过ch.assertQueue在这个通道上监听'hello'队列，并设置durable队列持久化为false,表示队列保存在内存中
      let ok = ch.assertQueue('hello', { durable: false });

      ok = ok.then(() => {
        // 让通道消费hello队列，并写上处理函数，打印消息数据
        return ch.consume(
          'hello',
          msg => {
            console.log(" [x] Received '%s'", msg.content.toString());
          },
          { noAck: true }
        );
      });

      return ok.then(() => {
        console.log(' [*] Waiting for messages. To exit press CTRL+C');
      });
    });
  })
  .catch(console.warn);
