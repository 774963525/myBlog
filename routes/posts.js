const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;
const postsModel = require('../models/posts');
const commentsModel = require('../models/comments');


// GET /post 或者 /posts?author = xxx 文章列表或指定作者的文章
router.get('/', (req, res, next) => {
    
    let author = req.query.author;
    postsModel.getPosts(author)
        .then((result) => {
            console.log(result);    
            res.render('posts', {posts: result});
        })
        .catch(next);
});
// 放在文章详细页下 会发生create倍识别为id的情况导致无法打开
// Cast to ObjectId failed for value "create" at path "_id" for model "posts"
// get/posts/create 发表文章的页面
router.get('/create',checkLogin,(req,res) =>{
    res.render('create');

})

// 文章详细页
router.get('/:postId',(req,res,next) =>{
    const postId = req.params.postId;

    Promise.all([
            postsModel.getPostById(postId),
            // 发送文章id 获取留言
            commentsModel.getComments(postId),
            postsModel.incPv(postId)
    ]).then((result) => {
            const post = result[0]; 
            const comments = result[1];

            // console .log(comments);
            if(!result){
                return res.redirect('/');
            }
            res.render('post',{
                post:post,
                comments:comments
            });
        })
        .catch(next)
    // res.render('post') 
})



// post /posts 执行文章的发表
router.post('/',checkLogin,(req,res) =>{
    const postDate = {
        author:req.session.user._id,
        title:req.fields.title,
        content:req.fields.content

    };

    postsModel.create(postDate)
        .then((result)=>{
            // console.log(result);
            let postId = result._id;
            req.flash('success','文章添加成功');
            // res.redirect(`/posts/${result._id}`);
            res.redirect('/posts/'+postId);
        })
        .catch((err) => {
            req.flash('error',err.toString().split(':').pop());
            res.redirect('back');
        });
    // console.log(postDate);
    // res.send('ok');
});

// get/posts/:postId/edit 修改文章页面
router.get('/:postId/edit',checkLogin,(req,res,next) =>{
    // res.send(req.originalUrl);
    let postId = req.params.postId;
    postsModel.getEditPostById(postId)
        .then( (result) => {
            res.render('edit',{post:result});
        })
        .catch(next)
    
});

// post/posts/:postId/edit  执行文章 修改
router.post('/:postId/edit',checkLogin,(req,res) =>{
    // res.send(req.originalUrl);
    // 取值 表单提交的postId
    let postId = req.params.postId;

    let postData = {
        title: req.fields.title,
        content: req.fields.content
    }
    postsModel.updatePostById(postId,postData)
        .then((result) => {
            console.log('duile');
            req.flash('success','更新成功');
            res.redirect(`/posts/${postId}`);
        })
        .catch((err) =>{
            console.log('错了');
            req.flash('error','更新失败');
            res.redirect('back');
        })
});

// 删除文章
router.get('/:postId/remove', checkLogin, (req, res) => {
    let postId = req.params.postId;

    Promise.all([
        postsModel.deletePostById(postId),
        commentsModel.deleteCommentByPostId(postId)
    ]).then((result) => {
            console.log('删除');
            req.flash('success','删除成功');
            res.redirect(`/posts`);
        })
        .catch((err) =>{
            req.flash('error','删除失败');
            res.redirect(`back`);
        });
});

// /POST /posts/:postId/comment  创建一条留言
router.post('/:postId/comment',checkLogin,(req, res) => {
    // 创建id
    let postId = req.params.postId;
    // 创建数据
    let commentData = {
        userId :req.session.user._id,
        postId:postId,
        content:req.fields.content
    };
    commentsModel.create(commentData)
        .then((result) => {
            req.flash('success','留言添加成功');
            res.redirect(`/posts/${postId}`);

        })
        .catch((err) => {
            req.flash('error',err.toString().split(':').pop());
            res.redirect('back');
        })
})

//GET /posts/:postId/comment/:commnetId/remove  删除留言
router.get('/:postsId/comment/:commentId/remove',checkLogin,(req, res) => {
    let commentId = req.params.commentId;
    commentsModel.deleteCommentById(commentId)
        .then(() => {
            req.flash('success',"删除成功");
            res.redirect('back');
        })
        .catch(() => {
            req.flash('error',"删除失败");
            res.redirect('back');
        })
});
module.exports = router;