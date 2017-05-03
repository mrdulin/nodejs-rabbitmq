import { Channel, Replies, ConsumeMessage } from 'amqplib';
import { pd } from 'pretty-data';

import { Connection, connect, createChannel, closeOnError } from '../mq';
import { QUEUE } from '../queue';

let count = 0;

async function main() {
  const conn: Connection | undefined = await connect();
  if (conn) {
    const channel: Channel | undefined = await createChannel(conn);

    if (channel) {
      try {
        await channel.assertQueue(QUEUE.HELLO, { durable: false });
      } catch (error) {
        return closeOnError(error, conn);
      }

      await consume(channel, conn);
    }
  }
}

async function consume(channel: Channel, conn: Connection) {
  let consumer: Replies.Consume;
  try {
    consumer = await channel.consume(
      QUEUE.HELLO,
      (message: ConsumeMessage | null) => onMessage(message, channel, consumer, conn),
      {
        noAck: false,
      },
    );
  } catch (error) {
    closeOnError(error, conn);
  }

  console.log('wait message');
}

async function onMessage(
  message: ConsumeMessage | null,
  channel: Channel,
  consumer: Replies.Consume,
  conn: Connection,
) {
  if (message) {
    console.log('count: ', count);
    count += 1;
    // console.log('Received message.fields: ', pd.json(message.fields));
    // console.log('Received message.properties: ', pd.json(message.properties));

    if (count < 3) {
      const content = message.content.toString();
      console.log('Received message.content: ', content);
      channel.ack(message);
    } else {
      await pause(channel, consumer);
      channel.nack(message);
      await sleep(5000);
      await resume(channel);
      await consume(channel, conn);
    }
  }
}
async function pause(channel: Channel, consumer: Replies.Consume) {
  try {
    await channel.cancel(consumer.consumerTag);
    console.log('pause receiving message');
  } catch (error) {
    console.error('channel.cancel failed');
    console.error(error);
  }
}

async function resume(channel: Channel) {
  try {
    await channel.recover();
    console.log('recover receiving message');
    count = 0;
  } catch (error) {
    console.error('channel.recover failed');
    console.error(error);
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main();
