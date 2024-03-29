const Blog = require("../models/blogModels");
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require('../utils/cloudinary');
const fs = require("fs");


const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json({ status: "success", newBlog });
    } catch (error) {
        throw new Error(error);
    }
});


const updateBlog = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validateMongoDbId(id)
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.json(updateBlog);
    } catch (error) {
        throw new Error(error);
    }
});


const getBlog = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getBlog = await Blog.findById(id)
            .populate("likes")
            .populate("dislikes");
        await Blog.findByIdAndUpdate(
            id,
            {
                $inc: { numViews: 1 },
            }, { new: true }
        )
        res.json(getBlog);
    } catch (error) {
        throw new Error(error);
    }
});


const getAllBlogs = asyncHandler(async (req, res) => {

    try {
        const getBlogs = await Blog.find();
        res.json(getBlogs)
    } catch (error) {
        throw new Error(error);
    }

});


const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id);
        res.json({ msg: "Blod Deleted", deleteBlog })
    } catch (error) {
        throw new Error(error);
    }
})




const likeBlog = asyncHandler(async (req, res) => {

    const { blogId } = req.body;

    validateMongoDbId(blogId);

    //  find the blog which you want to like
    const blog = await Blog.findById(blogId);
    //find the login User
    const loginUserId = req?.user?._id;
    //find if the user has like the Blog
    const isLiked = blog?.isLiked;
    // const isLiked = blog?.likes?.find(
    //     (userId) => userId?.toString() === loginUserId?.toString()
    // );
    // find if the user has dislike the Blog
    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    )
   
    if(alreadyDisliked){

        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false
        }, { new: true })
        res.json(blog);
    }

    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false
        }, { new: true })
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId },
            isLiked: true
        }, { new: true })
        res.json(blog);
    }
})


const disLikeBlog = asyncHandler(async (req, res) => {

    const { blogId } = req.body;

    validateMongoDbId(blogId);

    //  find the blog which you want to like
    const blog = await Blog.findById(blogId);
    //find th elogin User
    const loginUserId = req?.user?._id;
    //find if the user has like the Blog
    const isDisLiked = blog?.isDisliked;
    // const isDisLiked =  blog?.dislikes?.find(
    //     (userId) => userId?.toString() === loginUserId?.toString()
    // )
    // find if the user has dislike the Blog
    const alreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    )
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false
        }, { new: true })

        res.json(blog);
    }

    if (isDisLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false
        }, { new: true })
        res.json(blog);

    } else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { dislikes: loginUserId },
            isDisliked: true
        }, { new: true })
        res.json(blog);
    }
    
})

const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);


    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        console.log(req.files);
        const urls = [];
        const files = req.files;

        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }

        const findBlog = await Blog.findByIdAndUpdate(
            id, {
            images: urls.map((file) => {
                return file;
            })
        }, { new: true }
        )

        res.json(findBlog);
        console.log(">>>>>>>>" + findBlog);


    } catch (error) {
        throw new Error(error);
    }
})


module.exports = {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog,
    disLikeBlog,
    uploadImages

}