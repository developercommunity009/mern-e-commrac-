const Category = require("../models/prodCategoryModels");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createProdCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);

    } catch (error) {
        throw new Error(error);
    }
})

const updateProdCategory = asyncHandler(async (req, res) => {
    const {  id } = req.params;
    validateMongoDbId(id);
    try {
        const updateCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateCategory);
    } catch (error) {
        throw new Error(error);
    }
})


const deleteProdCategory = asyncHandler(async (req, res) => {
    const {  id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteCategory = await Category.findByIdAndDelete(id);
        res.json(deleteCategory);
    } catch (error) {
        throw new Error(error);
    }
})

const getaProdCategory = asyncHandler(async (req, res) => {
    const {  id } = req.params;
    validateMongoDbId(id);
    try {
        const getaCategory = await Category.findById(id);
        res.json(getaCategory);
    } catch (error) {
        throw new Error(error);
    }
})


const getallProdCategory = asyncHandler(async (req, res) => {
    try {
        const getallCategory = await Category.find();
        res.json(getallCategory);
    } catch (error) {
        throw new Error(error);
    }
})



module.exports = {
    createProdCategory,
    updateProdCategory,
    deleteProdCategory,
    getaProdCategory,
    getallProdCategory
};