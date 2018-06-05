# 管理用户

## 参考

https://www.rabbitmq.com/rabbitmqctl.8.html#User_Management

## 创建用户

保证`rabbitmq` server 启动

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl add_user DL pwc123
Adding user "DL" ...
```

如果`rabbitmq` server 没有启动，会出现如下错误:

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl add_user DL pwc123
Error: unable to perform an operation on node 'rabbit@localhost'. Please see diagnostics information and suggestions below.

Most common reasons for this are:

 * Target node is unreachable (e.g. due to hostname resolution, TCP connection or firewall issues)
 * CLI tool fails to authenticate with the server (e.g. due to CLI tool's Erlang cookie not matching that of the server)
 * Target node is not running

In addition to the diagnostics info below:

 * See the CLI, clustering and networking guides on http://rabbitmq.com/documentation.html to learn more
 * Consult server logs on node rabbit@localhost

DIAGNOSTICS
===========

attempted to contact: [rabbit@localhost]

rabbit@localhost:
  * connected to epmd (port 4369) on localhost
  * epmd reports: node 'rabbit' not running at all
                  other nodes on localhost: [rabbitmqcli10]
  * suggestion: start the node

Current node details:
 * node name: 'rabbitmqcli10@US-C02WG0GXHV2V'
 * effective user's home directory: /Users/ldu020
 * Erlang cookie hash: qKUVY2AJ+BSmdxYT9ckF9g==
```

## 查看`rabbit`服务器上存在哪些用户

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl list_users
Listing users ...
DL	[]
guest	[administrator]
```

## 修改用户密码

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl change_password DL pwc123123
Changing password for user "DL" ...
```

## 验证用户名和密码

先输入错误的密码

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl authenticate_user DL pwc123
Authenticating user "DL" ...
Error: failed to authenticate user "DL"
user 'DL' - invalid credentials
```

输入正确的密码

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl authenticate_user DL pwc123123
Authenticating user "DL" ...
Success
```

## 给 vhost 设置用户权限

https://www.rabbitmq.com/rabbitmqctl.8.html#set_permissions

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl set_permissions -p test DL ".*" ".*" ".*"
Setting permissions for user "DL" in vhost "test" ...
```

## 查看 vhost 的权限

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl list_permissions -p test
Listing permissions for vhost "test" ...
DL	.*	.*	.*
```

```bash
☁  nodejs-rabbitmq [master] ⚡  rabbitmqctl list_permissions
Listing permissions for vhost "/" ...
guest	.*	.*	.*
```

默认的`vhost`是`/`

## 列出用户的权限

```bash
☁  nodejs-rabbitmq [master] rabbitmqctl list_user_permissions DL
Listing permissions for user "DL" ...
test	.*	.*	.*
```
