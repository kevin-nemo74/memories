const express = require('express');
const router = express.Router();
let Campground = require('../models/posts');
let catchAsync = require('../utils/catchAsync');
let ExpressError = require('../utils/ExpressError');
let camps = require('../controllers/posts');
let { isLoggedIn, validatecamp, isAuthor } = require('../middleware');
let multer = require('multer');


router.get('/', catchAsync(camps.index));

router.get('/new', isLoggedIn, catchAsync(camps.newCampForm));

router.post('/new', isLoggedIn, upload.array('img'), validatecamp, catchAsync(camps.postNewCamp));

router.get('/:id', catchAsync(camps.showCampPage));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(camps.editForm));

router.post('/:id/edit', isLoggedIn, isAuthor, upload.array('img'), catchAsync(camps.postEdittedCamp));

router.delete('/:id', isAuthor, catchAsync(camps.deleteCamp));


module.exports = router;