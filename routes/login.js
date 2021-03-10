const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

//Show login
router.get('/', async(req, res) => {
    res.render('users/login')
});

//Do login
router.post('/', (req, res) => {
User.findOne({ email: req.body.email }, (err, user) => {
    if(err || !user) {
        return res.render("users/login", {errorMessage:`Email or password is incorrect (EMAIL)`})
    } else {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(result && !err) {
                req.session.loggedin = true
                console.log(`Login eseguito dall'utente ${req.body.email}`)
                return res.redirect("/");
            } else {
                return res.render("users/login", {errorMessage:`Email or password is incorrect (PASSWORD)`})
            }
        })
    }
    })
})

router.get('/logout', function(req, res,next) {
    req.session.destroy((err) => {
        if(err) console.log(err)
    })
    return res.redirect("/login")
})


module.exports = router