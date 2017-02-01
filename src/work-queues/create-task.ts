import { connect, createChannel, Connection, closeOnError } from '../mq';
import { Channel } from 'amqplib';
import { QUEUE } from '../queue';
import faker = require('faker');

async function main() {
  const conn: Connection | undefined = await connect();
  if (conn) {
    const channel: Channel | undefined = await createChannel(conn);

    if (channel) {
      await createTask(channel, conn);
    }
  }
}

async function createTask(channel: Channel, conn: Connection) {
  try {
    await channel.assertQueue(QUEUE.TASK_QUEUE, { durable: true });
  } catch (error) {
    return closeOnError(error, conn);
  }

  const message = faker.lorem.sentence();
  channel.sendToQueue(QUEUE.TASK_QUEUE, Buffer.from(message), { persistent: true });
  console.log(" [x] Sent '%s'", message);

  await channel.close();
  await conn.close();
}

main();
