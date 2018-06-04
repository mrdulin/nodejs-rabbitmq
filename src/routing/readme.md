# RabbitMQ 的队列路由

启动消费者，启动一个绑定路由 key 为 error、 warning 的消费者，再启动一个绑定路由 key 为 error、warning、info 的消费者。

shell 1:

```bash
☁  nodejs-rabbitmq [master] ⚡  node src/routing/receive-logs-direct.js warning error > src/routing/logs_from_rabbit.log
```

shell 2:

```bash
☁  nodejs-rabbitmq [master] ⚡  node src/routing/receive-logs-direct.js error info warning
 [*] Waiting for logs. To exit press CTRL+C.
```

查看`type`为`direct`的名为`direct_logs`的`exchange`与队列的绑定

队列`amq.gen-Pot00xwN1LeuKA9W0sl1Tg`有 3 个绑定，`binding key`是`error`, `info`和`warning`

队列`amq.gen-7I5dmUQEcn6eKo5b_OJn-A`有 2 个绑定，`binding key`是`error`和`warning`

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl list_bindings
Listing bindings for vhost /...
	exchange	amq.gen-7I5dmUQEcn6eKo5b_OJn-A	queue	amq.gen-7I5dmUQEcn6eKo5b_OJn-A	[]
	exchange	amq.gen-Pot00xwN1LeuKA9W0sl1Tg	queue	amq.gen-Pot00xwN1LeuKA9W0sl1Tg	[]
	exchange	durable_queue	queue	durable_queue	[]
	exchange	task_queue	queue	task_queue	[]
direct_logs	exchange	amq.gen-7I5dmUQEcn6eKo5b_OJn-A	queue	error	[]
direct_logs	exchange	amq.gen-Pot00xwN1LeuKA9W0sl1Tg	queue	error	[]
direct_logs	exchange	amq.gen-Pot00xwN1LeuKA9W0sl1Tg	queue	info	[]
direct_logs	exchange	amq.gen-7I5dmUQEcn6eKo5b_OJn-A	queue	warning	[]
direct_logs	exchange	amq.gen-Pot00xwN1LeuKA9W0sl1Tg	queue	warning	[]
```

生产者发送一个`error`级别的消息，这条消息既会输出到日志文件，也会在终端中打印出来

```bash
☁  nodejs-rabbitmq [master] ⚡  node src/routing/emit-log-direct.js error "Something bad happened"
 [x] Sent error:'Something bad happened'
```

生产者发送一个`info`级别的消息，这条消息不会输出到日志文件，只会在终端中打印出来

```bash
☁  nodejs-rabbitmq [master] ⚡  node src/routing/emit-log-direct.js info "A info message"
 [x] Sent info:'A info message'
```
