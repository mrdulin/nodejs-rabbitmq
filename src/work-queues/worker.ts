import { Channel, ConsumeMessage } from 'amqplib';

import { connect, createChannel, Connection, closeOnError } from '../mq';
import { QUEUE } from '../queue';

async function main() {
  const conn: Connection | undefined = await connect();
  if (conn) {
    const channel: Channel | undefined = await createChannel(conn);

    if (channel) {
      await startWorker(channel, conn);
    }
  }
}

async function startWorker(channel: Channel, conn: Connection) {
  try {
    await channel.assertQueue(QUEUE.TASK_QUEUE, { durable: true });
  } catch (error) {
    return closeOnError(error, conn);
  }
  channel.prefetch(1);

  try {
    await channel.consume(QUEUE.TASK_QUEUE, (message: ConsumeMessage | null) => doWork(channel, message), {
      noAck: false,
    });
  } catch (error) {
    return closeOnError(error, conn);
  }

  console.log(' [*] Waiting for messages. To exit press CTRL+C');
}

function doWork(channel: Channel, message: ConsumeMessage | null) {
  if (message) {
    const body = message.content.toString();
    console.log(" [x] Received '%s'", body);
    const secs = body.split(' ').length - 1;
    console.log(" [x] Task takes '%d' seconds", secs);
    setTimeout(() => {
      console.log(' [x] Done');
      channel.ack(message);
    }, secs * 1000);
  }
}

main();
