const { postSchema, commentSchema } = require('./shemas');
let ExpressError = require('./utils/ExpressError');
let Post = require('./models/posts');
let Comment = require('./models/comments');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next();
}


module.exports.validatepost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    let post = await Post.findById(id);
    if (!post.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/posts/${id}`);
    }
    next();
}
module.exports.isComAuthor = async (req, res, next) => {
    const { id, comId } = req.params;
    let comment = await Comment.findById(comID);
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/posts/${id}`);
    }
    next();
}


module.exports.validateComment = (req, res, next) => {

    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}