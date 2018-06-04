const amqp = require('amqplib');

amqp
  .connect('amqp://localhost')
  .then(conn => {
    process.once('SIGINT', () => {
      conn.close();
    });
    return conn.createChannel().then(ch => {
      const q = 'durable_queue';
      ch
        .assertQueue(q, { durable: true })
        .then(() => {
          return ch.consume(
            q,
            msg => {
              setTimeout(() => {
                console.log(" [x] Received '%s'", msg.content.toString());
                ch.ack(msg);
              }, 5 * 1000);
            },
            { noAck: false }
          );
        })
        .then(() => {
          console.log(' [*] Waiting for messages. To exit press CTRL+C');
        });
    });
  })
  .catch(console.warn);
