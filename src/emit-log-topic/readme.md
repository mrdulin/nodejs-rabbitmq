# topic exchange

## 测试

shell 1: consumer 1

```bash
☁  nodejs-rabbitmq [master] ⚡  node src/emit-log-topic/receive.js "#"
 [*] Waiting for logs. To exit press CTRL+C
```

shell 2: consumer 2

```bash
☁  nodejs-rabbitmq [master] ⚡  node src/emit-log-topic/receive.js "kern.*"
 [*] Waiting for logs. To exit press CTRL+C
```

shell 3: consumer 3

```bash
☁  nodejs-rabbitmq [master] ⚡  node src/emit-log-topic/receive.js "*.critical"
 [*] Waiting for logs. To exit press CTRL+C
```

shell 4: consumer 4

```bash
☁  nodejs-rabbitmq [master] ⚡  node src/emit-log-topic/receive.js "kern.*" "*.critical"
 [*] Waiting for logs. To exit press CTRL+C
```

查看`topic` `exchange`与队列的绑定

```bash
☁  nodejs-rabbitmq [master] rabbitmqctl list_bindings
Listing bindings for vhost /...
	exchange	amq.gen-FlToRps8cUdkXOc_N--P7w	queue	amq.gen-FlToRps8cUdkXOc_N--P7w	[]
	exchange	amq.gen-e0AbfxOSAgMCKhguvsEduQ	queue	amq.gen-e0AbfxOSAgMCKhguvsEduQ	[]
	exchange	amq.gen-nWhKLl5AAtQypfssJKULaQ	queue	amq.gen-nWhKLl5AAtQypfssJKULaQ	[]
	exchange	amq.gen-yNLaZv1bCqqc_-ALAl_6yw	queue	amq.gen-yNLaZv1bCqqc_-ALAl_6yw	[]
	exchange	durable_queue	queue	durable_queue	[]
	exchange	task_queue	queue	task_queue	[]
topic_logs	exchange	amq.gen-FlToRps8cUdkXOc_N--P7w	queue	#	[]
topic_logs	exchange	amq.gen-nWhKLl5AAtQypfssJKULaQ	queue	*.critical	[]
topic_logs	exchange	amq.gen-yNLaZv1bCqqc_-ALAl_6yw	queue	*.critical	[]
topic_logs	exchange	amq.gen-e0AbfxOSAgMCKhguvsEduQ	queue	kern.*	[]
topic_logs	exchange	amq.gen-yNLaZv1bCqqc_-ALAl_6yw	queue	kern.*	[]
```
