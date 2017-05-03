import { Channel, ConsumeMessage } from 'amqplib';
import request from 'request-promise';
import { pd } from 'pretty-data';

import { Connection, connect, createChannel, closeOnError } from '../mq';
import { QUEUE } from '../queue';

let breaker = 0;
const BREAKER_THRESHOLD = 5;
const BREAKER_PAUSE = 5 * 1000;
const API_URL = 'http://localhost:3000/create-user';

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
  try {
    await channel.consume(QUEUE.HELLO, (message: ConsumeMessage | null) => onMessage(message, channel, conn), {
      noAck: false,
    });
  } catch (error) {
    closeOnError(error, conn);
  }

  console.log('wait message');
}

async function onMessage(message: ConsumeMessage | null, channel: Channel, conn: Connection) {
  if (message) {
    let content: any;
    try {
      content = JSON.parse(message.content.toString());
      console.log('Received message.content: ', content);
    } catch (error) {
      return console.error(error);
    }

    try {
      await request.post(API_URL, { body: content, json: true });
      breaker = 0;
      channel.ack(message);
      console.log('create user succesfully.');
    } catch (error) {
      console.error(error.message);
      breaker += 1;

      if (breaker > BREAKER_THRESHOLD) {
        await pause(channel, (message.fields as any).consumerTag);
        await sleep(BREAKER_PAUSE);
        await consume(channel, conn);
      }
      channel.nack(message);
    }
  }
}
async function pause(channel: Channel, consumerTag: string) {
  try {
    console.log('consumerTag: ', consumerTag);
    await channel.cancel(consumerTag);
    console.log('pause receiving message');
  } catch (error) {
    console.error('channel.cancel failed');
    console.error(error);
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main();
