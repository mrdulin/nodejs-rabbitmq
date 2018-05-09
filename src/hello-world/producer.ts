import faker from 'faker';
import { pd } from 'pretty-data';

import { Channel, Connection } from 'amqplib';
import { QUEUE } from '../queue';
import { closeOnError, connect, createChannel } from '../mq';

async function startProducer(channel: Channel, conn: Connection) {
  try {
    // 同样把通道绑定到hello队列，并设定持久化为false
    await channel.assertQueue(QUEUE.HELLO, { durable: false });
  } catch (error) {
    return closeOnError(error, conn);
  }

  const message = {
    name: faker.name.findName(),
    email: faker.internet.email(),
  };
  const ok: boolean = channel.sendToQueue(QUEUE.HELLO, Buffer.from(JSON.stringify(message)));
  console.log('ok: ', ok);
  console.log(`[AMQP] sent: ${pd.json(message)}`);

  await channel.close();
}

async function main() {
  const conn: Connection | undefined = await connect();
  if (conn) {
    const channel: Channel | undefined = await createChannel(conn);

    if (channel) {
      await startProducer(channel, conn);
      process.exit();
    }
  }
}

main();
