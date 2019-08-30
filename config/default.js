// db.auth('bgadmin','123') myblog
module.exports = {
    port:3000,
    mongodb:'mongodb://bgadmin:123@localhost:27017/myblog',
    session: {
        secret: 'xdlblog',
        key: 'xdlblog',
        maxAge:2592000000
    }
    
};