let Post = require('../models/posts');
let User = require('../models/users');



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
    console.log(req.body)
    let newPost = new Post({
        title: title,
        body: body,
        author: req.user._id,
        privacy: req.body.privacy
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

module.exports.getRequests = async (req, res) => {
    const { id } = req.params;
    let user = await User.findById(id).populate('friendReqList');
    res.render('posts/friendReq', { user });
}

module.exports.getPage = async (req, res) => {
    const { id } = req.params;
    let user = await User.findById(id);
    let signedInUser = await User.findByUsername(req.session.passport.user);
    if (signedInUser._id in user.friends) {
        let posts = await Post.find({ author: user._id })
        return res.render('posts/friendPage', { posts, user });
    } else {
        let post = await Post.find({ author: user._id });
        let posts = [];
        for (po of post) {
            if (po.privacy == 'public') {
                posts.push(po);
            }
        }

        return res.render('posts/visitorPage', { user, posts });
    }

}


module.exports.addRequest = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    let signedInUser = await User.findByUsername(req.session.passport.user);
    user.friendReqList.push(signedInUser._id);
    user.friendReq += 1;
    await user.save();
    res.redirect(`/posts/${user._id}/page`);
}



module.exports.removeFriend



module.exports.acceptReq = async (req, res) => {
    const { id } = req.params;

}


module.exports.denyReq