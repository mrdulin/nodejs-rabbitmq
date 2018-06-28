const { Router } = require('express');
const rp = require('request-promise');
const uuidv1 = require('uuid/v1');

const config = require('../config');
const Order = require('../models/Order');

const router = Router();

router.get('/buy', (req, res) => {
  const options = {
    method: 'POST',
    uri: `http://${config.app.hostname}:${config.app.port}/withoutRabbitmq/buy`,
    body: {
      userId: uuidv1()
    },
    json: true
  };
  rp(options)
    .then(msg => {
      console.log('msg: ', msg);
      res.send(msg);
    })
    .catch(err => {
      res.send('请求出错');
    });
});

router.post('/buy', async (req, res) => {
  const { userId } = req.query;
  const date = Date.now();

  try {
    const count = await Order.count();
    console.log('order count: ', count);
    if (count < 100) {
      const order = await Order.create({ userId, date });
      res.send('创建order成功!');
    } else {
      res.send('秒杀光了！');
    }
  } catch (err) {
    console.log(err);
    res.send('服务器内部错误!');
  }
});

module.exports = router;
