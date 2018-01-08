import { Connection, closeOnError, connect, createChannel } from '../mq';
import { Channel, ConsumeMessage } from 'amqplib';
import { QUEUE } from '../queue';

async function startConsumer(channel: Channel, conn: Connection) {
  try {
    await channel.assertQueue(QUEUE.HELLO, { durable: false });
  } catch (error) {
    return closeOnError(error, conn);
  }

  try {
    await channel.consume(QUEUE.HELLO, (message: ConsumeMessage | null) => processMessage(message, channel), {
      noAck: false,
    });
  } catch (error) {
    closeOnError(error, conn);
  }
}

function processMessage(message: ConsumeMessage | null, channel: Channel) {
  if (message) {
    console.log("[AMQP] received '%s'", message.content.toString());
    channel.ack(message);
  }
}

async function main() {
  const conn: Connection | undefined = await connect();
  if (conn) {
    const channel: Channel | undefined = await createChannel(conn);

    if (channel) {
      startConsumer(channel, conn);
    }
  }
}

main();
