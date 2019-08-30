// 导入模块
const mongoose = require('mongoose');
const config = require('config-lite')(__dirname);

// 连接数据库

mongoose.connect(config.mongodb);
const conn = mongoose.connection;

conn.on('open',() => {
    console.log('mongodb连接成功');

});
conn.on('error',(err) => {
    throw err;
});
