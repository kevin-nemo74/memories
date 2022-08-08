let Post = require('../models/posts');



module.exports.index = async (req, res) => {
    let posts = await Post.find({});
    res.render('camps/index', { posts });
}


module.exports.newCampForm = async (req, res) => {
    res.render('posts/new');
}


module.exports.postNewPost = async (req, res, next) => {
    let { title, body } = req.body;
    let newPost = new Post({
        title: title,
        body: location,
        author: req.user._id
    });
    await newPost.save();
    req.flash('success', 'Successfully made a new memory');
    res.redirect(`/posts/${newPost._id}`);
}

// module.exports.showCampPage = async (req, res) => {
//     const { id } = req.params;
//     let camp = await Campground.findById(id).populate({
//         path: 'reviews',
//         populate: {
//             path: 'author'
//         }
//     }).populate('author');
//     if (!camp) {
//         req.flash('error', 'Cannot find that campground');
//         return res.redirect('/campgrounds');
//     }
//     res.render('camps/show', { camp });
// }

module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    let post = await Post.findById(id);
    if (!post) {
        req.flash('error', 'Cannot find that memory');
        return res.redirect('/posts');
    }
    res.render('posts/edit', { post });
}

module.exports.postEdittedPost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);

    let { title, body } = req.body;
    let update = {
        $set: {
            title: title,
            body: body
        }
    }
    await Post.updateOne({ _id: id }, update, { runValidators: true });
    await post.save();

    req.flash('success', 'Successfully updated');
    res.redirect(`/posts/${id}`);
}

module.exports.deletePost = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/posts');
}