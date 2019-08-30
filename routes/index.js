
//路由的基础 文件
module.exports = function(app) {
    //首页
    console.log('lail');
    app.get('/', (req, res) => {
        console.log('sdadasd ');
        res.redirect('/posts');
    })

    app.use('/register', require('./register'));
    app.use('/login', require('./login'));
    app.use('/logout', require('./logout'));
    app.use('/posts', require('./posts'));

    //定制404页面
    app.use((req,res) => {
        // 如果已发送响应头，则为 true，否则为 false。
        if(!res.headersSent){
            res.render('404');
        }

    })

}
