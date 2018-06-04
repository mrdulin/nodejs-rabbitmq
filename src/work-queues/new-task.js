const amqp = require('amqplib');

amqp
  .connect('amqp://localhost')
  .then(conn => {
    return conn
      .createChannel()
      .then(ch => {
        const q = 'task_queue';
        const ok = ch.assertQueue(q, { durable: true });

        return ok.then(() => {
          const msg = process.argv.slice(2).join(' ') || 'Hello World!';
          ch.sendToQueue(q, Buffer.from(msg), { deliveryMode: true });
          console.log(" [x] Sent '%s'", msg);
          return ch.close();
        });
      })
      .finally(() => {
        conn.close();
      });
  })
  .catch(console.warn);
