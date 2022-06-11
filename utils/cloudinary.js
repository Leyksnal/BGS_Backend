require('dotenv').config()
const cloudinary = require('cloudinary')

cloudinary.config({ 
    cloud_name: process.env.CLOUDNAME, 
    api_key: process.env.CLOUDKEY, 
    api_secret: process.env.CLOUDAPI,
    secure: true
  });

  module.exports = cloudinary