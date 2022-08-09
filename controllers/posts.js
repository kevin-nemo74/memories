let Post = require('../models/posts');



module.exports.index = async (req, res) => {
    let posts = await Post.find({}).populate('author');
    // let data = req.query.data;

    // // if (!data) {
    // //     return res.render('posts/index', { posts });
    // // }
    // // console.log('after ! data')
    // let search = await Post.find({
    //     title: {
    //         $regex: new RegExp('^' + data + '.*', 'i')
    //     }
    // });
    // console.log(search)
    res.render('posts/index', { posts });

}


module.exports.newPostForm = async (req, res) => {
    res.render('posts/new');
}


module.exports.postNewPost = async (req, res, next) => {
    let { title, body } = req.body;
    let newPost = new Post({
        title: title,
        body: body,
        author: req.user._id
    });
    await newPost.save();
    req.flash('success', 'Successfully made a new memory');
    res.redirect(`/posts/${newPost._id}`);
}

module.exports.showPostPage = async (req, res) => {
    const { id } = req.params;
    let post = await Post.findById(id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!post) {
        req.flash('error', 'Cannot find that memory');
        return res.redirect('/posts');
    }
    res.render('posts/show', { post });
}

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
    await Post.findByIdAndDelete(id);
    res.redirect('/posts');
}


module.exports.getMyMemories = async (req, res) => {
    const { id } = req.params;
    let memories = await Post.find({ author: id });
    res.render('posts/userMem', { memories });
}