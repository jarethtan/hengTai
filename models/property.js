const mongoose = require('mongoose')

const opts = { toJSON: {virtuals: true}} 

const propertySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum:['Completed', 'In-Progress'],
        required: true
    },
    year: {
        type: Number,
        max: 2050,
        min: 1990,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    propertyType: {
        type: String,
        required: true
    },
    units: {
        type: Number,
        required: true
    },
    bedroom: {
        type: Number,
        required: true
    },
    bathroom: {
        type: Number,
        required: true
    },
    images: [{
        url: String,
        filename: String
    }],
    lat: {
        type: String
    },
    lng: {
        type: String
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},opts)

propertySchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/properties/${this._id}">${this.name}</a></strong>
    <br>${this.location}
    <br>${this.description.substring(0,20)}...`
})

module.exports = mongoose.model('Property', propertySchema)

