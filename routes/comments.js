const express = require('express');
const router = express.Router({ mergeParams: true });
let catchAsync = require('../utils/catchAsync');
let ExpressError = require('../utils/ExpressError');
let { validateComment, isLoggedIn, isComAuthor } = require('../middleware');
let coms = require('../controllers/comments');


router.post('/', isLoggedIn, validateComment, catchAsync(coms.postComment));

router.delete('/:comId', isLoggedIn, isComAuthor, catchAsync(coms.deleteComment));

module.exports = router;