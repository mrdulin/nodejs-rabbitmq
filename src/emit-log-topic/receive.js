const amqp = require('amqplib');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: receive_logs_topic.js <facility>.<severity>');
  process.exit(1);
}

console.log('args: ', args);

amqp
  .connect('amqp://localhost')
  .then(conn => {
    return conn.createChannel().then(ch => {
      const ex = 'topic_logs';

      let ok = ch.assertExchange(ex, 'topic', { durable: false });

      ok = ok.then(() => {
        return ch.assertQueue('', { exclusive: true });
      });

      ok = ok.then(q => {
        const bindQueuePromises = args.map(key => {
          return ch.bindQueue(q.queue, ex, key);
        });

        return Promise.all(bindQueuePromises).then(() => {
          console.log('binding success');
          return q.queue;
        });
      });

      ok = ok.then(queue => {
        console.log('queue: ', queue);
        return ch.consume(
          queue,
          msg => {
            console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
          },
          { noAck: true }
        );
      });

      return ok.then(() => {
        console.log(' [*] Waiting for logs. To exit press CTRL+C');
      });
    });
  })
  .catch(console.error);
