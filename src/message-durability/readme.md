# 消息持久化

1.  队列持久化

需要 publisher 和 consumer 都设置`durable`为`true`

```js
ch.assertQueue('durable_queue', { durable: true });
```

2.  队列中消息持久化

```js
ch.sendToQueue(q, new Buffer(msg), { persistent: true });
```

## 测试

启动`rabbitmq` server

```bash
☁  nodejs [master] rabbitmq-server

  ##  ##
  ##  ##      RabbitMQ 3.7.5. Copyright (C) 2007-2018 Pivotal Software, Inc.
  ##########  Licensed under the MPL.  See http://www.rabbitmq.com/
  ######  ##
  ##########  Logs: /usr/local/var/log/rabbitmq/rabbit@localhost.log
                    /usr/local/var/log/rabbitmq/rabbit@localhost_upgrade.log

              Starting broker...
 completed with 6 plugins.
```

终端窗口 1:生产一个消息，发送到 rabbitmq 消息队列

```bash
☁  nodejs-rabbitmq [master] ⚡  node src/message-durability/publisher.js
 [x] Sent 'This is a durable queue with persistent message'
```

查看  消息队列列表和队列中的消息，可以看到`durable_queue`中有 1 条消息

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl list_queues
Timeout: 60.0 seconds ...
Listing queues for vhost / ...
task_queue	0
durable_queue	1
```

ctrl+c 停止`rabbitmq` server 后, 再次启动`rabbitmq` server，再次查看消息队列和队列中的消息

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl list_queues
Timeout: 60.0 seconds ...
Listing queues for vhost / ...
task_queue	0
durable_queue	1
```

消费者消费`durable_queue`队列中的消息

```bash
☁  nodejs-rabbitmq [master] ⚡  node src/message-durability/comsumer.js
 [*] Waiting for messages. To exit press CTRL+C
 [x] Received 'This is a durable queue with persistent message'
```

消费完成后，调用了`ch.ack()`确认了消息，因此`rabbitmq`会将这条消息从`durable_queue`队列中删除，再次查看消息队列和队列消息

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl list_queues
Timeout: 60.0 seconds ...
Listing queues for vhost / ...
task_queue	0
durable_queue	0
```
