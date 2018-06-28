const amqp = require('amqplib');

const fibonacci = require('./fibonacci');

async function main() {
  const q = 'rpc_queue';
  try {
    const conn = await amqp.connect('amqp://localhost');
    const ch = await conn.createChannel();
    await ch.assertQueue(q, { durable: false });
    ch.prefetch(1);
    console.log(' [x] Awaiting RPC requests');

    ch.consume(
      q,
      msg => {
        const n = Number.parseInt(msg.content.toString());
        console.log(' [.] fib(%d)', n);

        var r = fibonacci(n);

        ch.sendToQueue(msg.properties.replyTo, new Buffer(r.toString()), {
          correlationId: msg.properties.correlationId
        });

        ch.ack(msg);
      },
      { noAck: false }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
}

main();
