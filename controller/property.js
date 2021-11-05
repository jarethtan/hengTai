const Property = require('../models/property')
const {cloudinary} = require('../cloudinary/index')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocode = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
const {showImageTransform} = require('../cloudinary/resizing')

module.exports.showAllProperties = async(req,res) => {
    const properties = await Property.find({})
    const arrayProp = ['year', 'units']
    const arrayTitle = ['Search for Year Built between 1990 - 2030', 'Search No. of Units in the Project']
    res.render('properties/index', {properties, arrayProp, arrayTitle})
}

module.exports.searchForProperties = async(req,res) => {
    console.log(req.body)
    const arrayProp = ['year', 'units']
    const arrayTitle = ['Search for Year Built between 1990 - 2030', 'Search No. of Units in the Project']
    str = JSON.stringify(req.body)
    if (!(str.includes('search')) === true ) {
        const properties = await Property.find(req.body) // uses very basic search that focus more on integer search to generate result.
        res.render('properties/index', {properties, arrayProp, arrayTitle})
    } else {
        let reg = new RegExp(':([^}]+)')
        const subStr = str.match(reg)
        const searchProperties = await Property.find({$text: {$search: subStr[1]}}, {location: 1, propertyType: 1, name: 1}) // uses more complex search with text index from mongodb to find database. Can use partial search to generate results
        console.log(searchProperties)
        const properties = []
        for (let i =0; i < searchProperties.length; i++) {
            const searchedProperty = await Property.findById(searchProperties[i]._id)
            properties.push(searchedProperty)
        }
        res.render('properties/index', {properties, arrayProp, arrayTitle})
    }
}

module.exports.newPropertyForm = (req,res) => {
    res.render('properties/new')
}

module.exports.createNewProperty = async(req,res) => {
    const property = new Property(req.body)
    const data = await geocode.forwardGeocode({
        query: req.body.location,
        limit: 2
    }).send()
    property.geometry = data.body.features[0].geometry
    if (req.body.lng && req.body.lat) {
        property.lat = req.body.lat
        property.lng = req.body.lng
        property.geometry.coordinates = [req.body.lng,req.body.lat]
    }
    property.user = req.user._id
    property.images = req.files.map(i => ({url: i.path, filename: i.filename}))
    showImageTransform(property)
    await property.save()
    console.log(`${property.name} is added in property list.`, property)
    req.flash('success', `Successfully added ${property.name} into Heng Thai project list.`)
    res.redirect(`/properties/${property._id}`)
}

module.exports.showOneProperty = async(req,res) => {
    const property = await Property.findById(req.params.id).populate('user') 
    if (!property) {
        req.flash('error', 'Property not found.')
        return res.redirect('/properties')
    }
    res.render('properties/show', {property})
}

module.exports.propertyEditForm = async(req,res) => {
    const property = await Property.findById(req.params.id)
    if (!property) {
        req.flash('error', 'Property not found.')
        return res.redirect('/properties')
    }
    res.render('properties/edit', {property})
}

module.exports.updateProperty = async(req,res) => {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body)
    const data = await geocode.forwardGeocode({
        query: req.body.location,
        limit: 2
    }).send()
    property.geometry = data.body.features[0].geometry
    if (req.body.lng && req.body.lat) {
        property.lat = req.body.lat
        property.lng = req.body.lng
        property.geometry.type = 'Point'
        property.geometry.coordinates = [req.body.lng,req.body.lat]
    }
    if ((property.images.length + req.files.length) > 4) {
        for (let h=0; h < req.files.length; h++) {
            await cloudinary.uploader.destroy(req.files[h].filename)
        }
        req.flash('error', 'Only a maximum of FOUR images are allowed per property')
        res.redirect(`/properties/${property._id}/edit`)
    } else {
    const addedImages = req.files.map(i => ({url: i.path, filename: i.filename}))
    const addedTransformedImages = showImageTransform(addedImages)
    property.images = property.images.concat(addedTransformedImages)
    }
    if (req.body.deleteImages) {
        for (let i=0; i<req.body.deleteImages.length; i++) {
            for (let s=0; s<property.images.length; s++) {
                if (property.images[s].filename == req.body.deleteImages[i]) {
                    property.images.splice(s, 1)
                }
            }
            await cloudinary.uploader.destroy(req.body.deleteImages[i])
        }
    }
    await property.save()
    req.flash('success', `Successfully edited the property "${property.name}".`)
    res.redirect(`/properties/${property._id}`)
}

module.exports.deleteProperty = async(req,res) => {
    const property = await Property.findById(req.params.id)
    console.log(`deleting ${property.name} ...`)
    for (let i = 0; i < property.images.length; i++) {
        await cloudinary.uploader.destroy(property.images[i].filename)
    }
    await property.deleteOne()
    console.log('Successfully deleted property')
    req.flash('success', 'Successfully deleted the property.')
    res.redirect('/properties')
}