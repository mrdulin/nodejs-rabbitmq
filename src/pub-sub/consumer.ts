import { connect, createChannel, Connection, closeOnError, ExchangeType } from '../mq';
import { Channel, Replies } from 'amqplib';

async function main() {
  const conn: Connection | undefined = await connect();
  if (conn) {
    const channel: Channel | undefined = await createChannel(conn);

    if (channel) {
      await receiveLogs(channel, conn);
    }
  }
}

async function receiveLogs(channel: Channel, conn: Connection) {
  const exchange = 'logs';
  try {
    await channel.assertExchange(exchange, ExchangeType.fanout, { durable: false });
  } catch (error) {
    return closeOnError(error, conn);
  }

  let assertQueue: Replies.AssertQueue;
  try {
    // 声明随机名称队列，exclusive参数为true表示当消费者断开队列连接时，此队列就会删除
    // 声明队列时不传入名称，就可以生成一个有随机名称的队列
    assertQueue = await channel.assertQueue('', { exclusive: true });
  } catch (error) {
    return closeOnError(error, conn);
  }

  try {
    // 将队列和Exchange绑定在一起，bindQueue的第三个参数是路由配置
    await channel.bindQueue(assertQueue.queue, exchange, '');
  } catch (error) {
    return closeOnError(error, conn);
  }

  try {
    await channel.consume(assertQueue.queue, (message) => logMessage(message), { noAck: true });
  } catch (error) {
    closeOnError(error, conn);
  }

  console.log(' [*] Waiting for logs. To exit press CTRL+C');
}

function logMessage(message) {
  console.log(" [x] '%s'", message.content.toString());
}

main();
