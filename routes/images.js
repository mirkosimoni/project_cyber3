const express = require('express')
const router = express.Router()
const Image = require('../models/image')
const imageMimeTypes = ['image/jpeg', 'image/png', "image/gif"]
const isLogged = require('../middleware/login')

//All Images route
router.get('/', isLogged,async (req, res) => {
    let query = Image.find()
    if (req.query.imageName != null && req.query.imageName != ''){
        query = query.regex('imageName', new RegExp(req.query.imageName, 'i'))
    }
    if (req.query.loadDate != null && req.query.loadDate != ''){
        query = query.gte('loadDate', req.query.loadDate)
    }
    try{
        const images = await query.exec()
        res.render('images/index', {
            images: images,
            searchOptions: req.query
        })
    }catch {
        res.redirect('/')
    }
})

//New Image route
router.get('/new',isLogged,async (req, res) => {
    renderNewPage(res, new Image())
})

//Create Image route
router.post('/', async (req, res) => {
    const image = new Image({
        imageName: req.body.imageName,
        loadDate: new Date(req.body.loadDate),
        createDate: new Date(req.body.createDate),
        description: req.body.description
    })
    saveImage(image, req.body.photo)
    try{
        if (req.body.createDate > req.body.loadDate){
            res.render('images/new',{
                image: image,
                errorMessage: 'Loading Date cannot be before Creation Date'
            })
        }else{
        const newImage = await image.save()
        res.redirect(`images/${newImage.id}`)
        }
    }catch {
        renderNewPage(res, image, true)
    }
})

//Show Image Route
router.get('/:id', async (req, res) => {
    try{
        const image = await Image.findById(req.params.id).exec()
        res.render('images/show', {image : image})
    }catch {
        res.redirect('/')
    }
})

//Edit Image Route
router.get('/:id/edit',async (req, res) => {
    try {
        const image= await Image.findById(req.params.id)
        renderEditPage(res, image)
    }catch {
        res.redirect('/')
    }
})

//Update image route
router.put('/:id', async (req, res) => {
    let image
    try{
        image= await Image.findById(req.params.id)
        image.imageName = req.body.imageName
        image.loadDate = new Date(req.body.loadDate)
        image.createDate = new Date(req.body.createDate)
        image.description = req.body.description
        if(req.body.photo != null && req.body.photo !== ''){
            saveImage(image, req.body.photo)
        }
        if (req.body.createDate > req.body.loadDate) {
            res.render('images/edit', {
                image: image,
                errorMessage: 'Loading Date cannot be before Creation Date'
            })
        }else{
            await image.save()
            res.redirect(`/images/${image.id}`)
        }
    }catch {
        if(image != null){
            renderEditPage(res, image, true)
        } else {
            res.redirect('/')
        }
    }
})

router.delete('/:id',async (req, res) => {
    let image
    try{
        image = await Image.findById(req.params.id)
        await image.remove()
        res.redirect('/images')
    }catch {
        if (image != null) {
            res.render('images/show',{
            image: image,
                errorMessage: 'Could not remove this image!'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, image, hasError = false) {
    renderFormPage(res, image, 'new', hasError)
}

async function renderEditPage(res, image, hasError = false) {
    renderFormPage(res, image, 'edit', hasError)
}

async function renderFormPage(res, image, form, hasError = false) {
    try{
        const params = {
            image: image
        }
        if (hasError){
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Image'
            }else {
                params.errorMessage = 'Error Adding Image'
            }
        }
        res.render(`images/${form}`,params)
    }catch {
        res.redirect('/')
    }
}

function saveImage(image , imageEncoded) {
    if (imageEncoded == null) return
    const photo = JSON.parse(imageEncoded)
    if (photo != null && imageMimeTypes.includes(photo.type)) {
        image.loadedImage = new Buffer.from(photo.data, 'base64')
        image.loadedImageType = photo.type
    }
}

module.exports = router