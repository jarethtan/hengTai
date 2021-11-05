const {propertySchema, userSchema, carouselSchema} = require('./validateSchema')
const expressError = require('./utility/expressError')
const Property = require('./models/property')

module.exports.validateProperty = (req, res, next) => {
    const {error} = propertySchema.validate(req.body)
    const valid = error == null
    if (valid) {
        next()
    }
    else {
        const message = error.details.map(i => i.message).join(',')
        throw new expressError(message, 400)
    }
}

module.exports.validateUser = (req, res, next) => {
    const {error} = userSchema.validate(req.body)
    const valid = error == null
    if (valid) {
        next()
    } else {
        const message = error.details.map(i => i.message).join(',')
        throw new expressError(message, 400)
    }
}

module.exports.validateCarousel = (req, res, next) => {
    const {error} = carouselSchema.validate(req.body)
    const valid = error == null
    if (valid) {
        next()
    } else {
        const message = error.details.map(i => i.message).join(',')
        throw new expressError(message, 400)
    }
}

module.exports.requireLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in first.')
        req.session.returnToUrl = req.originalUrl // this method is taken from express. it is available. req.path show the path while req.originalUrl url or the previously visited Url. '.returnTo' is just some we can make up to add in the session. We must store the originalURL in this middleware because we placed the middleware in all the routes that needs to authenticate. we cannot place this in the login route only.
        res.redirect('/login')
    } else {
         next()
    }
}

module.exports.isAuthorised = async(req, res, next) => {
    const {id} = req.params // find the id portion of the URL. since the route url is properties/id/edit.
    const property = await Property.findById(id)
    if (property.user.equals(req.user._id)) {
        next()
    } else {
        req.flash('error', 'Only the user who create this Property is allowed to make modification')
        res.redirect(`/properties/${id}`)
    }
}
