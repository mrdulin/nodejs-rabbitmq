import { Connection, connect, createChannel, closeOnError } from '../mq';
import { Channel, Replies, ConsumeMessage } from 'amqplib';
import { QUEUE } from '../queue';
import faker = require('faker');

async function main() {
  const conn: Connection | undefined = await connect();
  if (conn) {
    const channel: Channel | undefined = await createChannel(conn);

    if (channel) {
      await produce(channel, conn);
    }
  }
}

async function produce(channel: Channel, conn: Connection) {
  try {
    await channel.assertQueue(QUEUE.HELLO, { durable: false });
  } catch (error) {
    return closeOnError(error, conn);
  }

  const message = {
    name: faker.name.findName(),
    email: faker.internet.email(),
  };

  channel.sendToQueue(QUEUE.HELLO, Buffer.from(JSON.stringify(message)), {
    timestamp: Date.now(),
    type: 'userCreated',
  });

  await channel.close();
  await conn.close();
}

main();
