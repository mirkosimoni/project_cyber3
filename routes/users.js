const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const isLogged = require('../middleware/login')

//All users route
router.get('/',isLogged, async(req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const users = await User.find(searchOptions)
        res.render('users/index', {
            users: users,
            searchOptions: req.query
        })
    }catch {
        res.redirect('/')
    }
})

//New user route
router.get('/new',isLogged,(req, res) => {
  res.render('users/new', {user: new User()})
})


//Create a new user route
router.post('/', async(req, res) =>{
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const emailExist = await User.findOne({email: req.body.email})
    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        password: hashedPassword,
        email: req.body.email,
        role: req.body.role
    })
    if (emailExist) {
        res.render('users/new', {
            user: user,
            errorMessage:'This email is already registered'})
    }else {
        try {
            await user.save()
            res.redirect(`/users`)
        } catch {
            res.render('users/new', {
                user: user,
                errorMessage: 'Error creating User'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let user
    try {
        user = await User.findById(req.params.id)
        await user.remove()
        res.redirect('/users' )
    } catch {
        if (user == null){
            res.redirect('/')
        } else {
            res.redirect(`/users/${user.id}`)
        }
    }
})


module.exports = router