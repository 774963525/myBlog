const express = require('express');
const path = require('path');
const router = express.Router();
const usersModule = require('../models/users');
const checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /register
//GET  /register   注册页面
router.get('/',checkNotLogin,  (req, res) => {

    //渲染注册页面
    res.render('register');
});

// POST /register
router.post('/',checkNotLogin,(req,res) => {
 //获取表单中的数据
    let user = {
        username: req.fields.username,
        password: req.fields.password,
        repassword: req.fields.repassword,
        sex: req.fields.sex,
        avatar: req.files.avatar.path.split(path.sep).pop(),
        bio: req.fields.bio
    };
    // console.log(user);
    // res.send('ok');
    // 向集合中添加文档
    usersModule.create(user)
        .then((result) => {
            // 注册成功 通知
            req.flash('success','注册成功');
            //跳转到登陆页
            res.redirect('/login');
        })
        .catch((err) => {
            let errMessage = err.toString().split(":").pop();
            // console.log(errMessage);
            // res.send('失败');
            req.flash('error',errMessage);
            // 跳到注册
            res.redirect('./register');

        })
})


module.exports = router;