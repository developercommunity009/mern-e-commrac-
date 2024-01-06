const express = require("express");
const { createProduct, getaProduct, 
    getAllProduct, productUpdate, 
    deleteProduct, addToWishlist,
     rating, 
     } = require("../controller/productCntrl");
const {isAdmin , authMiddleware} = require("../middlewares/authMIddleware");
const router = express.Router();


router.post("/", authMiddleware, isAdmin ,  createProduct);
router.get("/:id",authMiddleware , getaProduct);
router.get("/", getAllProduct);
router.put("/whishlist", authMiddleware , addToWishlist);
router.put("/rating", authMiddleware , rating);
router.put("/:id" , authMiddleware, isAdmin ,  productUpdate );
router.delete("/:id" , authMiddleware, isAdmin ,  deleteProduct );

    
module.exports =router;