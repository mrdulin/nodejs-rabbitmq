const amqp = require('amqplib');

const args = process.argv.slice(2);
const severity = args.length > 0 ? args[0] : 'info';
const message = args.slice(1).join(' ') || 'Hello World!';

amqp
  .connect('amqp://localhost')
  .then(conn => {
    return conn
      .createChannel()
      .then(ch => {
        // Exchange节点名称
        const ex = 'direct_logs';
        // 声明Exchange，类型为direct
        const ok = ch.assertExchange(ex, 'direct', { durable: false });

        return ok.then(() => {
          // 定义了路由变量severity，默认值为info
          // 向名为direct_logs的Exchange节点推送数据，并且带上路由变量severity
          ch.publish(ex, severity, Buffer.from(message));
          console.log(" [x] Sent %s:'%s'", severity, message);
          return ch.close();
        });
      })
      .finally(() => {
        conn.close();
      });
  })
  .catch(console.warn);
