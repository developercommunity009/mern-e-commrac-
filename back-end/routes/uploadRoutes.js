const express = require("express");
const {  deleteImages ,  uploadImages} = require("../controller/uploadCntrl");
const {isAdmin , authMiddleware} = require("../middlewares/authMIddleware");
const { uploadPhoto ,   productImagesResize } = require("../middlewares/uploadImages");
const router = express.Router();


router.post(
    "/",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images" ,10),
    productImagesResize,
    uploadImages
)
router.delete("/delete-img/:id" , authMiddleware, isAdmin ,  deleteImages );

    
module.exports =router;