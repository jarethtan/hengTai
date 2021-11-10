if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const path = require('path')

const engine = require('ejs-mate')
const mongoose = require('mongoose')

const flash = require('connect-flash')
const methodOverride = require('method-override')

const session = require('express-session')
const MongoStore = require('connect-mongo')

const passport = require('passport')
const localStrategy = require('passport-local')

const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')

const User = require('./models/user')

const propertyRoutes = require('./routes/property')
const userRoutes = require('./routes/user')
const carouselRoutes = require('./routes/carousel')

const expressError = require('./utility/expressError')
const mongodbUrl = process.env.DB_URL ||'mongodb://localhost:27017/hengtai' // this will change from development or production for production add 'process.env.DB_URL' in front of || then it go to heroku weblink.

mongoose.connect(mongodbUrl).catch(error => console.log(error))

const db = mongoose.connection
db.on('error', err => {
    console.log(err);
    })
db.once('open', ()=>{
    console.log('Database Connected')
})

app.use(flash())

app.engine('ejs', engine) // able to merge ejs-mate template (boilerplate, etc) to ejs template.
app.set('views', path.join(__dirname, 'views')) // everytime render an ejs file, it will look for the 'views' folder.
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: true}))
app.use(express.json({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public'))) 
app.use(mongoSanitize())

const secret = process.env.SECRET || 'thisIsASecret'

const store = MongoStore.create({
    mongoUrl: mongodbUrl,
    secret: secret,
    touchAfter: 24 * 60 * 60,
})

store.on("error", function (e) {
    console.log("Session Store Error!", e)
})

app.use(session({
    store: store,
    name: '_workName',
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, // security measure so that client side are unable to access the cookie.
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
        // secure: true // only added when website is in production. As localhost is not secure. if we put this true right now, the session will not work and we cannot log in.
    }
}))

app.use(helmet())

const scriptSrcUrls = [
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
];

const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];

const fontSrcUrls = [
    "https://fonts.gstatic.com",
    "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dplfqp7kf/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    next()
})

app.use('/properties', propertyRoutes)
app.use('/', userRoutes)
app.use('/home', carouselRoutes)

app.get('/aboutus', (req,res) => {
    res.render('aboutUs')
})

app.get('/contactus', (req,res) => {
    res.render('contactUs')
})

app.all('*', (req,res,next) => {
    const err = new expressError('Page not found' , 404)
    next(err)
})

app.use(function (err,req,res,next) {
    const status = err.status || 500
    res.status(status).render('error', {err})
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`CONNECTED TO PORT ${port}`)
})