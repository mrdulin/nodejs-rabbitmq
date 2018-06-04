# 在后台启动`rabbitmq` server 进程

## 前台启动

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

ctrl+c 退出

或者使用

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl stop
Stopping and halting node rabbit@localhost ...
```

退出

## detach 以后台进程方式启动

```bash
  nodejs [master] rabbitmq-server -detached
Warning: PID file not written; -detached was passed.
```

验证启动是否成功：

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl list_queues
Timeout: 60.0 seconds ...
Listing queues for vhost / ...
task_queue	0
durable_queue	0
```

停止`rabbitmq` server

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl stop
Stopping and halting node rabbit@localhost ...
```

或者使用`brew service`, 启动

```bash
☁  nodejs [master] brew services start rabbitmq
==> Successfully started `rabbitmq` (label: homebrew.mxcl.rabbitmq)
```

验证是否启动成功：

```bash
'☁  nodejs [master] brew services list
Name          Status  User   Plist
elasticsearch stopped
kibana        stopped
mongodb       stopped
rabbitmq      started ldu020 /Users/ldu020/Library/LaunchAgents/homebrew.mxcl.rabbitmq.plist
```

停止`rabbitmq` server

```bash
☁  nodejs [master] brew services stop rabbitmq
Stopping `rabbitmq`... (might take a while)
==> Successfully stopped `rabbitmq` (label: homebrew.mxcl.rabbitmq)
```
