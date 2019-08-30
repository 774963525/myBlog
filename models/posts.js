// 文章的模型设计

const mongoose = require('mongoose');
const moment = require('moment');
const marked = require('marked'); 
const objectIdToTimestamp = require('objectid-to-timestamp');
const commentsModel = require('./comments');
// 创建schema

const postsSchema = new mongoose.Schema({
    // 不存入名字.存用户id
    author:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
    
    title:{type:String,required:[true,'名字不能为空']},
    content:{type:String,required:[true,"文章内容不能为空"]},
    pv:{type:Number}
    },{
       
    collection:'posts'
});
//插件
postsSchema.plugin(function(schema){
    schema.post('find',function(result){
        return Promise.all(result.map(function(item){
            item.create_at =moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
            item.contentHtml = marked(item.content);
            
            return commentsModel.getCommentsCountById(item._id)
                .then((result) => {
                    item.commentsCount = result 
                })            
        }))
        
    }),
    schema.post('findOne',function(item){
        if(item){
            item.create_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
            item.contentHtml = marked(item.content);
            return commentsModel.getCommentsCountById(item._id)
                .then((result) => {
                    item.commentsCount = result;
                })
        }
        return item;
    })
})
// 创建model
const PostsModel = mongoose.model('posts',postsSchema);

// 导出方法
module.exports = {
    // 添加文章
    create(data) {
        let post = new PostsModel(data);
        return post.save();
    },

    // 查询所有文章
    getPosts(author) {
        let query = {};
 
        if (author) {
            query.author = author;
        }
 
        return  PostsModel
            .find(query)
            .populate('author')
            .sort({_id:-1})
            .exec()
     },
    
    // 查询具体文章
    getPostById(postId) {
        return PostsModel
            .findOne({_id: postId})
            .populate('author')
            .exec();
    },

    //文章浏览次数 + 1
    incPv(postId) {
        return PostsModel
            .update({_id: postId}, {$inc: {pv: 1}})
            .exec();
    },

    // 根据id查询文章
    getEditPostById(postId){
        return PostsModel
            .findById(postId)
            .exec();
    },

    // 根据文章id 更新文章
    updatePostById(postId,data){
        return PostsModel
            .update({_id:postId},{$set:data})
            .exec(); 
    },
    // 根据文章id,删除文章
    deletePostById(postId){
        return PostsModel
            .deleteOne({_id:postId})
            .exec();
    }
}