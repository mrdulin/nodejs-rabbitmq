import amqp, { Connection, Channel } from 'amqplib';

import { getEnvVars, EnvVars } from './env';

enum ExchangeType {
  direct = 'direct',
  topic = 'topic',
  headers = 'headers',
  fanout = 'fanout',
}

async function connect(): Promise<Connection | undefined> {
  const env: EnvVars = getEnvVars();

  let connection: Connection;
  try {
    connection = await amqp.connect(env.AMQP_URL);
  } catch (error) {
    console.error(`[AMQP] ${error.message}`);
    return process.exit(1);
  }

  connection.on('error', (error) => {
    if (error.message !== 'Connection closing') {
      console.error('[AMQP] conn error', error.message);
      process.exit(1);
    }
  });

  connection.on('close', function() {
    console.error('[AMQP] conn close');
    process.exit(1);
  });

  // 接收CTRL+C的退出信号，关闭和RabbitMQ的连接
  process.once('SIGINT', async () => {
    await connection.close();
  });

  console.log('[AMQP] connected');
  return connection;
}

async function closeOnError(error: Error | string | undefined, connection: Connection) {
  if (error) {
    console.error('[AMQP] error: ', error);
    try {
      await connection.close();
    } catch (err) {
      console.error('[AMQP] close error: ', err);
      process.exit(1);
    }
  }
}

async function createChannel(conn: Connection): Promise<Channel | undefined> {
  let channel: Channel;
  try {
    channel = await conn.createChannel();

    channel.on('error', function(err) {
      console.error('[AMQP] channel error', err.message);
    });

    channel.on('close', function() {
      console.log('[AMQP] channel closed');
    });

    return channel;
  } catch (error) {
    console.error('[AMQP] create channel failed');
    closeOnError(error, conn);
  }
}

export { connect, Connection, closeOnError, createChannel, ExchangeType };
