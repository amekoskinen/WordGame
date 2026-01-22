if(process.env.NODE_ENV !=="production"){
    require('dotenv').config({ quiet: true});
}
const mongoose = require('mongoose')
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const { MongoStore } = require('connect-mongo');

const ExpressError = require('./utils/ExpressError');
const wordGameRoute = require('./routes/wordGameRoute')

const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/wordGame'

mongoose.connect(dbURL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const secret = process.env.SESSION_SECRET || "temporarysecret";

const store = MongoStore.create({
    mongoUrl: dbURL,
    touchAfter: 24 * 60 * 60,
    crypto: {
            secret
        }
    });

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionOptions = { 
        store,
        name: "session",
        secret, 
        resave: false, 
        saveUninitialized: false, 
        cookie: {
          httpOnly: true,
          expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
          maxAge: 1000 * 60 * 60 * 24 * 7
        }
}

const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('strict routing', false);

app.use(express.static('public'))
app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/wordgame/', wordGameRoute);

app.get('/', (req,res) => {
  res.redirect('/wordgame/')
})

app.all('/{*any}', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
