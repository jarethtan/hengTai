const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
})
if (process.env.NODE_ENV !== 'production') {
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'Heng Thai',
            allowedFormats: ['jpg', 'png', 'jpeg']
        }
    })


    module.exports = {storage, cloudinary}
}