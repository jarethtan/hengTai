const express = require('express')
const router = express.Router()
const carouselController = require('../controller/carousel')

const {storage} = require('../cloudinary/index')
const multer = require('multer')
const upload = multer({storage})

const handleAsync = require('../utility/handleAsync')
const {requireLogin, validateCarousel} = require('../middleware')

router.get('/', handleAsync(carouselController.homePage))

router.get('/carouselForm', requireLogin, carouselController.newCarouselForm)

router.post('/', requireLogin, upload.single('image'), validateCarousel, handleAsync(carouselController.createNewCarousel))

router.get('/:id/edit', requireLogin, handleAsync(carouselController.carouselEditForm))

router.put('/:id/edit', requireLogin, upload.single('image'), handleAsync(carouselController.updateCarousel))

router.delete('/:id/edit', requireLogin, handleAsync(carouselController.deleteCarousel))

module.exports = router