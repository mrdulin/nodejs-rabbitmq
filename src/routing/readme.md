# RabbitMQ 的队列路由

启动消费者，启动一个绑定路由 key 为 error 的消费者，再启动一个绑定路由 key 为 error、warning、info 的消费者。

```bash
node receive-logs-direct.js info warning error
```

```bash
node receive-logs-direct.js error
```

然后我们分别发送 error 级别的消息和 info 级别的消息，在发送 error 级别消息时，两个消费者都打印了消息，但是在发送 info 级别的消息时，就只有其中一个打印了消息
