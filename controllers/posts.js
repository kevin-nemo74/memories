let Post = require('../models/posts');
let User = require('../models/users');
let { isLoggedIn } = require('../middleware');
let { cloudinary } = require('../cloudinary');



module.exports.index = async (req, res) => {

    let posts = await Post.find({}).populate('author');
    let friendsPosts = [];


    if (req.isAuthenticated()) {
        let signedInUser = await User.findByUsername(req.session.passport.user);
        for (let i = 0; i < posts.length; i++) {
            if ((posts[i].privacy === 'friends' && signedInUser.friends.includes(posts[i].author._id)) || (posts[i].privacy == 'public')) {
                friendsPosts.push(posts[i]);
            }
        }
        return res.render('posts/index', { posts: friendsPosts });
    }
    else {
        posts = await Post.find({ privacy: 'public' }).populate('author');
        return res.render('posts/index', { posts });
    }
}


module.exports.newPostForm = async (req, res) => {
    res.render('posts/new');
}


module.exports.postNewPost = async (req, res, next) => {
    let { title, body } = req.body;
    let imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    let newPost = new Post({
        title: title,
        body: body,
        images: imgs,
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
    let imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));

    let { title, body, privacy } = req.body;
    let update = {
        $set: {
            title: title,
            body: body,
            privacy
        }
    }
    await Post.updateOne({ _id: id }, update, { runValidators: true });
    post.images.push(...imgs);
    await post.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await post.updateOne({
            $pull: {
                images: { filename: { $in: req.body.deleteImages } }
            }
        })
    }

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

    if (signedInUser.friends.includes(user._id)) {
        let posts = await Post.find({ author: user._id })
        return res.render('posts/friendPage', { posts, user });
    } else if (signedInUser.username == user.username) {
        return res.redirect(`/posts/${id}/memories`);
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
    await user.save();
    res.redirect(`/posts/${user._id}/page`);
}



module.exports.removeFriend = async (req, res) => {
    const { id } = req.params;
    let user = await User.findById(id);
    let signedInUser = await User.findByUsername(req.session.passport.user);
    let index = signedInUser.friends.indexOf(user._id);
    let index1 = user.friends.indexOf(signedInUser._id);
    signedInUser.friends.splice(index, 1);
    user.friends.splice(index1, 1);
    await signedInUser.save();
    await user.save();
    res.redirect(`/posts/${id}/page`);
}



module.exports.acceptReq = async (req, res) => {
    const { id, acceptedId } = req.params;
    let user = await User.findById(id);
    let acceptedUser = await User.findById(acceptedId);
    let index = user.friendReqList.indexOf(acceptedId);
    if (index > -1) {
        user.friendReqList.splice(index, 1);

        user.friends.push(acceptedId);
        acceptedUser.friends.push(id);
    }
    await user.save();
    await acceptedUser.save();
    res.redirect(`/posts/${user._id}/memories/requests`)
}


module.exports.denyReq = async (req, res) => {
    const { id, deniedId } = req.params;
    let user = await User.findById(id);
    let index = user.friendReqList.indexOf(deniedId);
    if (index > -1) {
        user.friendReqList.splice(index, 1);
    }
    await user.save();
    res.redirect(`/posts/${user._id}/memories/requests`)
}


module.exports.friendsList = async (req, res) => {
    const { id } = req.params;
    let user = await User.findById(id).populate('friends');
    res.render('posts/friendList', { user });
}