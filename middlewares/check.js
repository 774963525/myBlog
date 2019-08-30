module.exports = {

    //只有登陆才可以往下进行
    checkLogin: function(req, res, next){
        if (!req.session.user) {
            req.flash('error', '请登陆');
            return res.redirect('/login');
        }
        next();
    },


    //只有未登陆 才能往下进行
    checkNotLogin: function(req, res, next) {
        if (req.session.user) {
            req.flash('error', '您已经登陆,请先退出登陆');
            return res.redirect('back');
        }
        next();
    }
}