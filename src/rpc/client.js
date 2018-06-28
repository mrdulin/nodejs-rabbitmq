const amqp = require('amqplib');

const args = process.argv.slice(2);

if (!args.length) {
  console.log('Usage: rpc_client.js num');
  process.exit(1);
}

async function main() {
  try {
    const conn = await amqp.connect('amqp://localhost');
    const ch = await conn.createChannel();
    const q = await ch.assertQueue('', { exclusive: true });

    const corr = generateUuid();
    const num = parseInt(args[0]);

    console.log(' [x] Requesting fib(%d)', num);

    ch.consume(
      q.queue,
      msg => {
        if (msg.properties.correlationId == corr) {
          console.log(' [.] Got %s', msg.content.toString());
          setTimeout(function() {
            conn.close();
            process.exit(0);
          }, 500);
        }
      },
      { noAck: true }
    );

    ch.sendToQueue('rpc_queue', Buffer.from(num.toString()), { correlationId: corr, replyTo: q.queue });
  } catch (err) {}
}

main();

function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}
