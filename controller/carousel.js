const Carousel = require('../models/carousel')
const {cloudinary} = require('../cloudinary/index')
const {homeImageTransform} = require('../cloudinary/resizing')

module.exports.homePage = async(req,res) => {
    const carousels = await Carousel.find({})
    res.render('home', {carousels})
}

module.exports.newCarouselForm = (req,res) => {
    res.render('carousel/new')
}

module.exports.createNewCarousel = async(req,res) => {
    const carousel = new Carousel(req.body)
    carousel.user = req.user._id
    carousel.image.url = req.file.path
    carousel.image.filename = req.file.filename
    homeImageTransform(carousel)
    await carousel.save()
    console.log(`${carousel.title} is added in property list.`, carousel)
    req.flash('success', `Successfully added carousel titled: ${carousel.title} into Heng Thai home Page.`)
    res.redirect('/home')
}

module.exports.carouselEditForm = async(req,res) => {
    const carousel = await Carousel.findById(req.params.id)
    if (!carousel) {
        req.flash('error', 'Carousel not found.')
        return res.redirect('/home')
    }
    res.render('carousel/edit', {carousel})
}

module.exports.updateCarousel = async(req,res) => {
    const carousel = await Carousel.findByIdAndUpdate(req.params.id, req.body)
    if (req.body.deleteImage) {
    if (req.body.deleteImage === carousel.image.filename) {
        carousel.image.url = undefined
        carousel.image.filename = undefined
    } else {
        req.flash('error', 'Unable to delete image. Something went wrong.')
        return res.redirect(`/home/${carousel._id}/edit`) 
    }
    await cloudinary.uploader.destroy(req.body.deleteImage)
    }
    if (req.file) {
    if (carousel.image.url == undefined && carousel.image.filename == undefined) {
        carousel.image.url = req.file.path
        carousel.image.filename = req.file.filename
        homeImageTransform(carousel)
    } else {
        await cloudinary.uploader.destroy(req.file.filename)
        req.flash('error', 'User is required to delete existing carousel image before uploading a new image.')
        return res.redirect(`/home/${carousel._id}/edit`)
    }
    }
    await carousel.save()
    req.flash('success', `Carousel titled (${carousel.title}) have been successfully edited`)
    res.redirect('/home')
}

module.exports.deleteCarousel = async(req,res) => {
    const carousel = await Carousel.findById(req.params.id)
    await cloudinary.uploader.destroy(carousel.image.filename)
    await carousel.deleteOne()
    req.flash('success', 'Successfully deleted the carousel.')
    res.redirect('/home')
}