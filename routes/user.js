let express = require('express');
let router = express.Router();
let User = require('../models/users');
let catchAsync = require('../utils/catchAsync');
let passport = require('passport');
let users = require('../controllers/users');


router.get('/register', users.registerForm);

router.post('/register', catchAsync(users.postNewUser));

router.get('/login', users.loginForm);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser);

router.get('/logout', users.logout);

module.exports = router;