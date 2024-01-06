const Coupen = require("../models/coupenModels");
const validateMongoDbId = require("../utils/validateMongodbId");
const asyncHandler = require("express-async-handler");


const createCoupen = asyncHandler(async( req , res )=>{
    try {
        const newCoupen = await Coupen.create(req.body);
        res.json(newCoupen);
    } catch (error) {
        throw new Error(error);
    }
})

const getAllCoupen = asyncHandler(async( req , res )=>{
    try {
        const getAllCoupen = await Coupen.find();
        res.json(getAllCoupen);
    } catch (error) {
        throw new Error(error);
    }
})

const updateCoupen = asyncHandler(async( req , res )=>{
    const { id }= req.params;
    validateMongoDbId(id)
    try {
        const updateCoupen = await Coupen.findByIdAndUpdate(id , req.body , {new: true});
        res.json(updateCoupen);
    } catch (error) {
        throw new Error(error);
    }
})

const deleteCoupen = asyncHandler(async( req , res )=>{
    const { id }= req.params;
    try {
        const deleteCoupen = await Coupen.findByIdAndDelete(id);
        res.json(deleteCoupen);
    } catch (error) {
        throw new Error(error);
    }
})
const getaCoupen = asyncHandler(async( req , res )=>{
    const { id }= req.params;
    try {
        const coupen = await Coupen.findById(id);
        res.json(coupen);
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {
     createCoupen , getAllCoupen , updateCoupen , deleteCoupen , getaCoupen
}
