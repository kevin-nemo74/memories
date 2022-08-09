const express = require('express');
const router = express.Router();
let Post = require('../models/posts');
let catchAsync = require('../utils/catchAsync');
let ExpressError = require('../utils/ExpressError');
let posts = require('../controllers/posts');
let { isLoggedIn, validatepost, isAuthor } = require('../middleware');


router.get('/', catchAsync(posts.index));

router.get('/new', isLoggedIn, catchAsync(posts.newPostForm));

router.post('/new', isLoggedIn, validatepost, catchAsync(posts.postNewPost));

router.get('/:id', catchAsync(posts.showPostPage));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(posts.editForm));

router.post('/:id/edit', isLoggedIn, isAuthor, catchAsync(posts.postEdittedPost));

router.get('/:id/memories', isLoggedIn, catchAsync(posts.getMyMemories));

router.delete('/:id', isAuthor, catchAsync(posts.deletePost));


module.exports = router;