const Comment = require('../models/comments');
let Post = require('../models/posts');

module.exports.postComment = async (req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;

    //fix time
    let currentdate = new Date();
    let datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1)
        + " "
        + currentdate.getHours() + 1 + ":"
        + currentdate.getMinutes()
        ;

    comment.time = datetime;

    post.comments.push(comment);
    await comment.save();
    await post.save();
    console.log(comment);
    res.redirect(`/posts/${post._id}`);
}

module.exports.deleteComment = async (req, res) => {
    const { id, comId } = req.params
    await Post.findByIdAndUpdate(id, { $pull: { comId } })
    await Comment.findByIdAndDelete(comId);
    res.redirect(`/posts/${id}`);
}