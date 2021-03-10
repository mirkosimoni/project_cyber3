if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('passport')
const expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
});

const indexRouter = require('./routes/index')
const userRouter = require('./routes/users')
const imageRouter = require('./routes/images')
const loginRouter = require('./routes/login')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(methodOverride('_method'))
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit:'10mb', extended: false }))
app.use(passport.initialize());
app.use(passport.session());
app.use(expressSession);

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => {console.log('Connected to Mongoose')
})

app.use('/', indexRouter)
app.use('/users', userRouter)
app.use('/images', imageRouter)
app.use('/login', loginRouter)

app.listen(process.env.PORT || 3000)
console.log(`Server ready! Go at http://localhost:3000`)