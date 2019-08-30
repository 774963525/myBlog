// 导包
const mongoose = require('mongoose');
const objectIdToTimestamp = require('objectid-to-timestamp');
const moment = require('moment');

// 创建Schema
const commentScheme =new  mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
    postId:{type:mongoose.Schema.Types.ObjectId},
    content:{type:String,required:[true,'留言不得为空']}
    },{
    collection:'comments'
});

// 
commentScheme.plugin(function(schema){
    schema.post('find',function(result){
        result.forEach(function(item){
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm:ss');
        })
    })
})

// 创建模型
const commentModel = mongoose.model('comments',commentScheme);


// 导出接口
module.exports = {
    // 添加留言
    create(commentData){
        const comment = new commentModel(commentData);
        return comment.save();
    },

    //  根据文章id 显示留言
    getComments(postId){
        return commentModel
            .find({postId:postId})
            .populate('userId')      
            .sort({_id:-1})
            .exec()
    },
    // 根据postid返回留言数量
    getCommentsCountById(postId){
        return commentModel.count({postId:postId}).exec();
    },

    // 根据id删除留言
    deleteCommentById(commentId){
        return commentModel.deleteOne({_id:commentId}).exec();
    },
    // 根据postid删除留言
    deleteCommentByPostId(postId) {
        return commentModel.deleteMany({postId: postId}).exec();
    }

}