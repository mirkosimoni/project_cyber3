const mongoose = require('mongoose')


const imageSchema = new mongoose.Schema({
    imageName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    loadDate: {
        type: Date,
        required: true
    },
    createDate: {
        type: Date,
        required: true
    },
    createAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    loadedImageType: {
        type: String,
        required: true
    },
    loadedImage: {
        type: Buffer,
        required: true
    }
})

imageSchema.virtual('loadedImagePath').get(function (){
    if (this.loadedImage != null && this.loadedImageType != null) {
        return `data:${this.loadedImageType};charset=utf-8;base64,
        ${this.loadedImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Image', imageSchema)
