const express = require('express')
const Path = require('path')
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { connectDatabase} = require('./services/database');
const passport = require('passport')
const { User } = require('./Models/User');
require('./services/passport');

const homepath = Path.join(__dirname, 'views/homepage.html')

const connectDB = async() => {
    await connectDatabase();  
    };
connectDB();


app.use(session({
    secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 2 * 60 * 1000 } // 1 hour
  }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());


const checkAuthenticated = (req, res, next) => {
    console.log("Req.user", req.user, req.isAuthenticated());
    if (req.isAuthenticated()) { return next() }
    res.redirect("/signin")
  }

app.get('/', (req, res) => {
    res.sendFile(homepath)
});

app.get('/signup', (req, res) => {
    res.sendFile(Path.join(__dirname, 'views/signup.html'))
});

app.post('/signup', async (req, res) => {
    console.log("REQ.BOD&",req.body)
    try {
        const user = await User.create({username: req.body.username, email: req.body.email, password: req.body.password});
        console.log("User value Inserted");
    } catch (error) {
        console.log("Insertion Error", error)
    } 
    res.sendFile(Path.join(__dirname, 'views/homepage.html'))
})


app.get('/signin', (req, res) => {
    console.log("Authenticated ?", req.isAuthenticated(), req.session.passport)
    res.sendFile(Path.join(__dirname, 'views/signin.html'));
});


app.post('/signin', passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
function(req, res) {
  res.send(req.user.username);
});

app.get('/firstpage', checkAuthenticated, (req, res) => {
    res.send("Firstpage...");
})

app.listen(8000, () => {
    console.log("Server started successfully");
})

