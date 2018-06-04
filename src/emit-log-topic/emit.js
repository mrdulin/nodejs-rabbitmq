const amqp = require('amqplib');

amqp
  .connect('amqp://localhost')
  .then(conn => {
    return conn
      .createChannel()
      .then(ch => {
        const ex = 'topic_logs';
        const args = process.argv.slice(2);
        const routingKey = args.length ? args[0] : 'anonymous.info';
        const msg = args.slice(1).join(' ') || 'Hello World!';

        return ch.assertExchange(ex, 'topic', { durable: false }).then(() => {
          ch.publish(ex, routingKey, Buffer.from(msg));
          console.log(" [x] Sent %s:'%s'", routingKey, msg);
          return ch.close();
        });
      })
      .finally(() => {
        conn.close();
      });
  })
  .catch(console.error);
