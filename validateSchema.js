const { string } = require('joi')
const baseJoi = require('joi')
const sanitizeHtml = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [], // this is to state which tags, which are stripped with sanitize-html package, you want to allow. if this is empty, this means u allow nothing.
                    allowedAttributes: {}, // this is to state which attributes, which are stripped with sanitize-html package, you want to allow. if this is empty, this means u allow nothing.
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = baseJoi.extend(extension) 

module.exports.propertySchema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(40)
            .required()
            .escapeHTML(),
        status: Joi.string()
            .required()
            .escapeHTML(),
        year: Joi.number()
            .integer()
            .min(1990)
            .max(2030)
            .required(),
        bedroom: Joi.number()
            .max(30)
            .required(),
        bathroom: Joi.number()
            .max(30)
            .required(),
        location: Joi.string()
            .min(3)
            .max(50)
            .required()
            .escapeHTML(),
        description: Joi.string()
            .required()
            .escapeHTML(),
        propertyType: Joi.string()
            .required()
            .escapeHTML(),
        units: Joi.number()
            .required()
            .max(150),
        deleteImages: Joi.array()
})

module.exports.userSchema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(10)
            .escapeHTML(),
        password: Joi.string()
            .min(6)
            .max(12)
            .escapeHTML(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .escapeHTML()
    }).required()

module.exports.carouselSchema = Joi.object({
        title: Joi.string()
            .required()
            .escapeHTML(),
        subheader: Joi.string()
            .escapeHTML(),
        content: Joi.string()
            .escapeHTML(),
        deleteImage: Joi.array()
    })

