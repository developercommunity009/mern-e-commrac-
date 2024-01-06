const express = require("express");
const {
     createProdCategory,
     updateProdCategory,
     deleteProdCategory,
     getaProdCategory, 
     getallProdCategory 
} = require("../controller/blogCatgCntrl");

const { isAdmin, authMiddleware } = require("../middlewares/authMIddleware");
const router = express.Router();


router.post("/"   , authMiddleware, isAdmin,  createProdCategory )
router.put("/:id"   , authMiddleware, isAdmin,  updateProdCategory)
router.delete("/:id"   , authMiddleware, isAdmin,  deleteProdCategory)
router.get("/:id"  , getaProdCategory)
router.get("/"    , getallProdCategory)

module.exports = router;