const config = {
  MONGODB: {
    HOST: 'localhost',
    PORT: 27017,
    USERNAME: '',
    PASSWORD: '',
    DBNAME: 'nodejs-rabbitmq'
  },
  RABBITMQ: {
    connection: {
      hostname: 'skunk.rmq.cloudamqp.com',
      username: 'fxhguaet',
      password: 'Pswf0RqdnEjkvyGVI3KfhpMt7IAxJ7a0',
      vhost: 'fxhguaet'
    },
    queue: 'seckill'
  },
  app: {
    hostname: 'localhost',
    port: 4000
  }
};

module.exports = config;
