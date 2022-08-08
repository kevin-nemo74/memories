let User = require('../models/users');

module.exports.registerForm = (req, res) => {
    res.render('users/register');
}

module.exports.postNewUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Thoughts!');
            res.redirect('/posts');
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back');
    let redirectUrl = res.locals.returnTo || '/posts';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'Goodbye!');
        res.redirect('/posts');
    });
}