//ES6 so we are using const
//To import any module we use require tag
const express = require('express');
//For accessing local css, js and images
const path = require('path');
// importing handlebars
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');

const passport = require('passport');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
// It initialize our application 
const app = express(); 

//Load Manu Routes
const menu = require('./routes/menu');

//Load User Routes
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;
//Connect to Mongoose 
mongoose.connect('mongodb://localhost/nyg-dev', {useNewUrlParser: true })
.then(()=> console.log('NYG MongoDB Connected'))
.catch(err => console.log(err));




//Every import has its middleware
//Handlebar Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars'); 
// layout => wrap arount other views, common elements we put on main page and use it everywhere

//Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static FOlder
app.use(express.static(path.join(__dirname, "public")));

//Method override middleware
//Using PUT Request without using ajax request
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

//Express Session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
    
  }));

  //Passport Middleware
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());


  //Global Variables
  app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user = req.user || null;
    next(); // to call next piece of middleware
  });


//How Middleware Works
app.use(function(req, res, next){
    console.log(Date.now());
    req.name = 'Shivesh Kumar';
    next();
});
//Index Route
//get() for handaling a get request - going to webpage
//post() used  to update something server, database
//put() update any resource which is already at the server
//delete() to delete any resource

app.get('/',(req, res)=>{
    const title = 'Welcome1';
    res.render('index',{
        title: title
    }); //It send this to browser
});

app.get('/about',(req, res)=>{
    res.render('about');
});

   
// Use Menu routes
app.use('/menu', menu);

//Use users routes
app.use('/users', users);


const port = 7001;
app.listen(port, ()=>{
    // back tick `` called a template string, it allows to include variables without concatinate 
    console.log(` Server started on port ${port}`); // equivalent to console.lo g(' Server started on port' + port)
     
});