const express = require('express');
const path = require('path');
// 自动加载当前目录环境变量
const config = require('config-lite')(__dirname);
const pkg = require('./package.json');
const routers = require('./routes/index');
const winston = require('winston');
const expressWinston = require('express-winston');
// 表单传参取值
const formidable = require('express-formidable');
// 导入session包
const session = require('express-session');
// mongo有关session的一个插件
const MongoStore = require('connect-mongo')(session);
// 专门用来做消息通知 将通知放在session中
const flash = require('connect-flash');

// 创建express 应用
const app = express();

// 创建模板引擎的应用
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');



// 静态文件托管
app.use(express.static(path.join(__dirname,'public')));

// 设置session
//session中间件
app.use(session({
    name: config.session.key,  //设置cookie保存session_id的字段名称
    secret: config.session.secret, //通过设置 secret来计算hash值并放在cookie中，使产生signedCookie 防篡改
    cookie: {
        maxAge: config.session.maxAge //过期时间 session_id存储到cookie上的过期时间
    },
    store: new MongoStore({   //session存储到mongodb中
        url: config.mongodb
    }),
    resave:false,
    saveUninitialized:true
}));

// flash中间件 显示通知

app.use(flash());


// 设置模板全局变量
app.locals.blog ={
    title:pkg.name,
    description:pkg.description
};


//中间件 向模板中添加全局变量
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

// 中间件在跳转之前执行
// 处理post请求和文件上传的中间件
app.use(formidable({
//  文件上传位置
    uploadDir:path.join(__dirname,'public/img'),
//  保留上传文件后缀
    keepExtension:true

}));

// 设置用户正常请求
// app.use(expressWinston.logger({
//     transports: [
//         new (winston.transports.Console) ({
//             json: true,
//             colorizie: true
//         }),
//         new (winston.transports.File) ({
//             filename: 'logs/success.log'
//         })
//     ]
// }));
// 设置路由
routers(app);

//记录用户错误的请求
app.use(expressWinston.errorLogger({
    transports: [
        new (winston.transports.Console) ({
            json: true,
            colorize: true
        }),
        new (winston.transports.File) ({
            filename: 'logs/error.log'
        })
    ]
}));

//500定制错误页面   
app.use((err, req, res, next) => {
    res.status(500).render('error', {error: err});
})


app.listen(config.port,()=>{
    console.log( `${pkg.name} 监听 ${config.port} 端口号`);
})

