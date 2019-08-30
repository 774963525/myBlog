const express = require('express');
const router = express.Router();

// GET /logout
router.get('/',(req,res) =>{
    // 清空session退出登录
    req.session.user = null; ;
    // 跳转
    req.flash('success','退出成功');
    res.redirect('/');
})


module.exports = router;
