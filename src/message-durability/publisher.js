const amqp = require('amqplib');

amqp
  .connect('amqp://localhost')
  .then(conn => {
    return conn
      .createChannel()
      .then(ch => {
        const q = 'durable_queue';
        const msg = 'This is a durable queue with persistent message';
        return ch.assertQueue(q, { durable: true }).then(() => {
          ch.sendToQueue(q, Buffer.from(msg), { persistent: true });
          console.log(" [x] Sent '%s'", msg);
          return ch.close();
        });
      })
      .finally(() => {
        conn.close();
      });
  })
  .catch(console.error);
