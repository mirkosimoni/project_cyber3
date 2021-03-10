const express = require('express')
const router = express.Router()
const Image = require('../models/image')
const isLoggedIn = require('../middleware/login')


router.get('/',isLoggedIn, async (req, res) => {
    let images
    try{
        images = await Image.find().sort({createAt:'desc'}).limit(10).exec()
    }catch {
        images = []
    }
    res.render('index', { images : images})
} )

module.exports = router