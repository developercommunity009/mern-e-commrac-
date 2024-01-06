
// cloudinary is vedio Management tool

// const cloudinary = require('cloudinary').v2;
const cloudinary = require('cloudinary');
// const url = require("path");
cloudinary.config({
    cloud_name: "dqurfceko",
    api_key: "453535247587342",
    api_secret: "__QB7PSmjwpYKYkPkZf6uQAVwTs"
});

const cloudinaryUploadingImg = async(fileToUploads) =>{
    return new Promise((resolve)=>{
        // console.log(resolve);
        cloudinary.uploader.upload(fileToUploads , (result) => {
            // console.log(result)
            resolve(
                {
                    url: result.url,
                    assest_id: result.asset_id,
                    public_id: result.public_id,
                },
                {
                    resource_type: "auto",
                }
            )
        });
    });
}
const cloudinaryDeleteImg = async(fileToDelete) =>{
    return new Promise((resolve)=>{
        // console.log(resolve);
        cloudinary.uploader.destroy(fileToDelete , (result) => {
            // console.log(result)
            resolve(
                {
                    url: result.url,
                    assest_id: result.asset_id,
                    public_id: result.public_id,
                },
                {
                    resource_type: "auto",
                }
            )
        });
    });
}

module.exports = {cloudinaryUploadingImg , cloudinaryDeleteImg };