import { connect, createChannel, Connection, closeOnError } from '../mq';
import { Channel } from 'amqplib';
import faker = require('faker');

async function main() {
  const conn: Connection | undefined = await connect();
  if (conn) {
    const channel: Channel | undefined = await createChannel(conn);

    if (channel) {
      await emitLog(channel, conn);
    }
  }
}

async function emitLog(channel: Channel, conn: Connection) {
  const exchange: string = 'logs';
  // its value is ignored for fanout exchanges
  const routingKey: string = '';
  try {
    // 定义Exchange，命名为logs，类型为fanout，durable持久化队列为false
    await channel.assertExchange(exchange, 'fanout', { durable: false });
  } catch (error) {
    return closeOnError(error, conn);
  }

  const message = faker.company.bs();
  try {
    channel.publish(exchange, routingKey, Buffer.from(message));
  } catch (error) {
    return closeOnError(error, conn);
  }

  await channel.close();
  await conn.close();
}

main();
