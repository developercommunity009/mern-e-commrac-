const express = require("express");
const { createBlog, updateBlog, getBlog,
     getAllBlogs, deleteBlog, likeBlog, disLikeBlog, uploadImages } = require("../controller/blogCntrl");
const { authMiddleware , isAdmin } = require("../middlewares/authMIddleware");
const { uploadPhoto,  blogImagesResize } = require("../middlewares/uploadImages");
const router = express.Router();


router.post('/' , authMiddleware , isAdmin , createBlog);
router.put('/likes' , authMiddleware , likeBlog);
router.put('/dislikes' , authMiddleware , disLikeBlog);
router.put("/upload/:id" , authMiddleware , isAdmin , uploadPhoto.array("images", 10), blogImagesResize  ,  uploadImages );
router.put('/:id' , authMiddleware , isAdmin , updateBlog);
router.get('/:id' , getBlog);
router.get('/' , getAllBlogs);

router.delete('/:id' , authMiddleware , isAdmin, deleteBlog);


module.exports = router;