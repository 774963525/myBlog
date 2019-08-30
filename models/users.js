// 用户集合模板
const mongoose = require('mongoose');
// 密码加密
const sha1 = require("sha1");
require('../lib/mongo');

// 定义schema

const UsersSchema = new mongoose.Schema({
    username:{type:String,required:[true,'用户名不能为空'],minlength:[2,"用户名最少两个字符"],maxlength:[10,"用户名不得超过十个字符"], unique:[true, '用户名已经被占用'],index:true},
    password:{type:String,required:[true,'密码不能为空']},
    avatar:{type:String},
    sex:{type:String,enum:{values:['m','w','e'],message:'性别不能乱写'}},
    bio:{type:String}
},{autoIndex:true,collection:'users'});

// 创建模型
const UsersModel = mongoose.model('users',UsersSchema);

// 导出
module.exports = {
    create(user){
        // 验证
        if(user.password.length < 6){
            return new Promise((resolve,reject) => {
                reject('自定义错误:password:密码长度至少6位');
            })
        }
        // 验证密码是否一致
        if(user.password !== user.repassword){
            return new Promise((resolve,reject) => {
                reject('自定义错误:password:密码不一致,请重新输入');
            })
        }
        // 密码加密
        user.password = sha1(user.password);
        delete user.repassword; //删除确认密码
        let userInstance = new UsersModel(user);
        return userInstance.save();

    },
    findOneByName(username){
        return UsersModel.findOne({username:username}).exec();
    }
}