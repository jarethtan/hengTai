const express = require('express')
const router = express.Router()
const propertyController = require('../controller/property')
const {storage} = require('../cloudinary/index')
const multer = require('multer')
const upload = multer({storage})

const handleAsync = require('../utility/handleAsync')
const {validateProperty, requireLogin, isAuthorised} = require('../middleware')

router.get('/', handleAsync(propertyController.showAllProperties))

router.search('/', handleAsync(propertyController.searchForProperties))

router.get('/new', requireLogin, propertyController.newPropertyForm)

router.post('/', upload.array('images', 4), validateProperty, handleAsync(propertyController.createNewProperty))

router.get('/:id', handleAsync(propertyController.showOneProperty))

router.get('/:id/edit', requireLogin, isAuthorised, handleAsync(propertyController.propertyEditForm))

router.put('/:id', requireLogin, upload.array('images', 4), validateProperty, isAuthorised, handleAsync(propertyController.updateProperty))

router.delete('/:id', requireLogin, isAuthorised, handleAsync(propertyController.deleteProperty))

module.exports = router