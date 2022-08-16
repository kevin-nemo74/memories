let cloudinary = require('cloudinary').v2;
let { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
})

let storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'thoughts',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
})

module.exports = {
    cloudinary,
    storage
}