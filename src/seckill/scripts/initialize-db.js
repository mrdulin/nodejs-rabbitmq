const mongoose = require('mongoose');

require('../db');
const Order = require('../models/Order');

const datas = [];

for (let i = 0; i < 10; i++) {
  datas.push({ userId: i, date: Date.now() });
}

async function main() {
  try {
    const r = await mongoose.connection.dropCollection('orders');
    console.log('r: ', r);
    const orderDocs = await Order.insertMany(datas);
    const total = await Order.count();
    console.log(`order documents are inserted successfully! Total Number: ${total}`);
  } catch (err) {
    console.log(err);
  }
}

main();
