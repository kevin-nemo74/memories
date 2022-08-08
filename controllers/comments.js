const Comment = require('../models/comments');
let Post = require('../models/posts');

module.exports.postComment = async (req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    post.comments.push(comment);
    await comment.save();
    await post.save();
    console.log(post);
    res.redirect(`/posts/${post._id}`);
}

module.exports.deleteComment = async (req, res) => {
    const { id, comId } = req.params
    await Post.findByIdAndUpdate(id, { $pull: { comId } })
    await Comment.findByIdAndDelete(comId);
    res.redirect(`/posts/${id}`);
}