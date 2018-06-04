# RabbitMQ 的 PUB/SUB 队列

场景：一个消息有多个消费者订阅

生产者只是把消息传递给 Exchange。Exchange 非常简单，一边连接着生产者，接收生产者发送过来的数据；另一边连接着队列，负责把数据推送到队列中去。Exchange 必须知道它将对接收到的数据做什么处理，例如将数据推送到指定的队列，又或者推送到多条队列中，我们将这样类似的行为称为 Exchange 类型。这些类型是预设好的，有如下几种类型：direct、topic、headers 和 fanout

fanout 中文直译是“扇出”，表示将消息广播出去

## 查看 exchange 和 queue 的 绑定(bindings)

shell 1: consumer 1

```bash
☁  nodejs-rabbitmq [master] ⚡  node src/pub-sub/receive-logs.js
 [*] Waiting for logs. To exit press CTRL+C
```

shell 2: comsumer 2

```bash
☁  nodejs-rabbitmq [master] ⚡  node src/pub-sub/receive-logs.js > src/pub-sub/logs_from_rabbit.log
```

查看名字为`logs`的`exchange`绑定的队列:

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl list_bindings
Listing bindings for vhost /...
	exchange	amq.gen-56gPx9eSYI8oxanpRoYrXw	queue	amq.gen-56gPx9eSYI8oxanpRoYrXw	[]
	exchange	amq.gen-Iv8P6bvsCo8AShGyu4gBcw	queue	amq.gen-Iv8P6bvsCo8AShGyu4gBcw	[]
	exchange	durable_queue	queue	durable_queue	[]
	exchange	task_queue	queue	task_queue	[]
logs	exchange	amq.gen-56gPx9eSYI8oxanpRoYrXw	queue		[]
logs	exchange	amq.gen-Iv8P6bvsCo8AShGyu4gBcw	queue		[]
```
