const amqp = require('amqplib');

function doWork(ch, msg) {
  const body = msg.content.toString();
  console.log(" [x] Received '%s'", body);
  const secs = body.split('.').length - 1;
  console.log(" [x] Task takes '%d' seconds", secs);
  setTimeout(() => {
    console.log(' [x] Done');
    ch.ack(msg);
  }, secs * 1000);
}

amqp
  .connect('amqp://localhost')
  .then(conn => {
    process.once('SIGINT', () => {
      conn.close();
    });
    return conn.createChannel().then(ch => {
      let ok = ch.assertQueue('task_queue', { durable: true });
      ok = ok.then(() => {
        ch.prefetch(1);
      });
      ok = ok.then(() => {
        ch.consume('task_queue', msg => doWork(ch, msg), { noAck: false });
        console.log(' [*] Waiting for messages. To exit press CTRL+C');
      });
      return ok;
    });
  })
  .catch(console.warn);
