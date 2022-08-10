if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

let express = require('express');
let app = express();
let mongoose = require('mongoose');
let path = require('path');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let ejsMate = require('ejs-mate');
let ExpressError = require('./utils/ExpressError');
let session = require('express-session');
let flash = require('connect-flash');
let passport = require('passport');
let LocalStrategy = require('passport-local');
let mongoSanitize = require('express-mongo-sanitize');
let dbUrl = process.env.dbUrl;
let secret = process.env.SECRET;
let MongoDBStore = require('connect-mongo');
let User = require('./models/users');
let Posts = require('./models/posts');


const post = require('./routes/posts');
const commentsRoute = require('./routes/comments');
const userRoutes = require('./routes/user');
// mongodb://localhost:27017/thoughtsCamp

mongoose.connect(dbUrl, { useNewUrlParser: true })
    .then(() => {
        console.log('database connected!! ');
    })
    .catch((err) => {
        console.log('oh noo error');
        console.log(err);
    })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

let store = MongoDBStore.create({
    mongoUrl: dbUrl,
    ttl: 24 * 60 * 60
});

store.on('error', function (e) {
    console.log('SESSION STORE ERROR', e)
})

const sessionConfig = {
    store,
    name: 'blah',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        // secure: true
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.returnTo = req.session.returnTo;
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('home');
})


//ROUTES
// app.post('/getPosts', async (req, res) => {
//     let payload = req.body.payload;
//     res.redirect('/posts?data=' + payload);
// })


app.use('/', userRoutes);
app.use('/posts', post);
app.use('/posts/:id/comment', commentsRoute);


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no something went wrong';
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server started !!! ');
})