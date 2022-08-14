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

router.get('/:id/memories/requests', isLoggedIn, catchAsync(posts.getRequests));

router.get('/:id/page', isLoggedIn, catchAsync(posts.getPage));

router.get('/:id/add', isLoggedIn, catchAsync(posts.addRequest));


router.delete('/:id', isAuthor, catchAsync(posts.deletePost));

//get done 

router.get('/:id/memories/requests/accept', isLoggedIn, catchAsync(posts.acceptReq));

router.get('/:id/memories/requests/deny', isLoggedIn, catchAsync(posts.denyReq));

router.get('/:id/remove', isLoggedIn, catchAsync(posts.removeFriend));

module.exports = router;