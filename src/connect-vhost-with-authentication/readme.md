# 使用用户名和密码连接 localhost 上的 vhost

## 新建 vhost

新建一个名叫`test`的`vhost`

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl add_vhost test
Adding vhost "test" ...
```

## 查看 vhost

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl list_vhosts
Listing vhosts ...
/
test
```

## 查看不同 vhost 上的队列

`vhost` - `/`

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl list_queues -p /
Timeout: 60.0 seconds ...
Listing queues for vhost / ...
task_queue	0
durable_queue	0
```

`vhost` - `test`

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl list_queues -p test
Timeout: 60.0 seconds ...
Listing queues for vhost test ...
```

## 测试

生产者

```bash
☁  nodejs-rabbitmq [master] ⚡  node src/connect-vhost-with-authentication/mq-send.js
 [x] Sent 'Hello World!'
```

消费者

```bash
☁  nodejs-rabbitmq [master] ⚡  node src/connect-vhost-with-authentication/mq-receive.js
 [*] Waiting for messages. To exit press CTRL+C
 [x] Received 'Hello World!'
```

再次查看`test` `vhost`上的队列

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl list_queues -p test
Timeout: 60.0 seconds ...
Listing queues for vhost test ...
connect-vhost-with-authentication	0
```
