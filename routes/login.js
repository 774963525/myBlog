const express = require('express');
const router = express.Router();
const userModel = require('../models/users');
const sha1 = require('sha1');
const checkNotLogin = require('../middlewares/check').checkNotLogin;
// GET /login
router.get('/',checkNotLogin,(req,res) =>{
    res.render('login');
})

router.post('/',checkNotLogin,(req,res) => {
    console.log(req.session);
    // 获取表单数据
    let username = req.fields.username;
    let password = req.fields.password;
    // console.log(username+','+password);
    // 从集合中获取数据
    userModel.findOneByName(username)
        .then((result) =>{
            // console.log(result);
            if(!result){
                // 用户不存在
                req.flash('error','用户名不存在');
                return res.redirect('back');
            }
            // 判断密码是否匹配
            if(sha1(password)!=result.password){
                // 密码错误
                req.flash('error','密码错误');
                res.redirect('back');
            }

            // 登陆成功
            // 把用户信息写入session
            // session存入密码不安全
            delete result.password;
            req.session.user = result;
            req.flash('success','登陆成功');
            res.redirect('/');
            

        })
        .catch((err) => {
            next(err);
        });
    // res.send('ok');
})
module.exports = router;
