const express = require('express')
const Path = require('path')
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const { connectDatabase} = require('./services/database');
const passport = require('passport')
const { User } = require('./Models/User');
const { Book } = require('./Models/Books');
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
    cookie: { maxAge: 2 * 60 * 1000 } // 2 minutes
  }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());


const checkAuthenticated = (req, res, next) => {
    console.log("Req.user Auth Status", req.user, req.isAuthenticated());
    if (req.isAuthenticated()) { 
     
        return next();
     }
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
    console.log("REQ.BOD&",req.headers);

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


app.post('/signin', passport.authenticate('local', { failureRedirect: '/loginFailed', failureMessage: true }),
function(req, res) {
    console.log("STatusCode", res.statusCode);
    console.log("STatusCode", res.body);

    console.log("Entered signIn post call",  req.isAuthenticated())
  res.send(req.user.username);
});

app.get('/firstpage', checkAuthenticated, (req, res) => {
    res.send("Firstpage...");
})


// Books Api's
// require('./services/booksApi')(app);

//GET books
app.get("/books", checkAuthenticated, async (req, res) => {
    try {
        await Book.create({title: 'Hello', author: 'Narayanan', category: 'NodeJS'});
        await Book.create({title: 'Express', author: 'Narayanan', category: 'Express'});
        console.log("Book value Inserted");
    } catch (error) {
        console.log("Book Insertion Error", error)
    } 
    const result = await Book.findAll();
    console.log("Result", result);
    res.send(result);
});

app.post('/books',checkAuthenticated, async (req, res) => {
    console.log("Books Request", Object.keys(req) );
    console.log("Books Request", req.body );

    try {
        const Books = await Book.create({title: req.body.title, author: req.body.author, category: req.body.category});
        console.log("Response Books /Post=> ", res.body)
        console.log("Book value Inserted");
        res.send(Books);
    } catch (error) {
        console.log("Insertion Error", error)
    } 
})

app.get('/books/:id',checkAuthenticated, async (req, res) => {
    console.log("Books Search Request", req.params );
    const ID = req.params.id;
    let isnum = /^\d+$/.test(ID);
    let Books;
    if(!isnum) {
        console.log("ISNUM", isnum)
        res.status(400).send('Invalid ID supplied')
    }
    try {
        Books = await Book.findByPk(ID);
        console.log("Response Books /GET ID => ",Books)
        if(Books === null) {
            res.status(400).send('Book not found')
        }
        res.send(Books)
        console.log("Book value Found");
    } catch (error) {
        console.log("Search Error", error)
        res.send('Book not found');
    } 
})


app.put('/books/:id', checkAuthenticated, async function(req, res){
    const ID = req.params.id;
    let Books;
    console.log("Request => ", req.body)
    try {
        Books = await Book.findByPk(ID);
        console.log("Response Books /GET ID => ",Books)
        if(Books === null) {
            res.status(400).send('Book not found')
        }
        let bookUpdate = await Book.update( req.body , {
            where: {
              id: ID
            }
          })
        res.send(bookUpdate)
        console.log("Book value Found");
    } catch (error) {
        console.log("Search Error", error)
        res.send('Book not found');
    } 
})

app.delete('/books/:id',checkAuthenticated, async function(req, res) {
    let ID = req.params.id; 
    try {
        const Books = await Book.destroy({
            where: {
             id: ID
            }
          })
        console.log("Book value Deleted", Books);
        await res.send(Books.toString());
    } catch (error) {
        console.log("Deletion Error", error)
    } 
})

module.exports = 
app.listen(8000, () => {
    console.log("Server started successfully");
})

