const mongoose = require('mongoose')

const carouselSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    subheader: {
        type: String,
    },
    image: {
        url: String,
        filename: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Carousel', carouselSchema)