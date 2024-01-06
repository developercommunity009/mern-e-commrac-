const express = require("express");
const {
    createBrand,
    updateBrand,
    deleteBrand,
    getaBrand,
    getallBrand } = require("../controller/brandCntrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMIddleware");
const router = express.Router();


router.post("/", authMiddleware, isAdmin, createBrand)
router.put("/:id", authMiddleware, isAdmin, updateBrand)
router.delete("/:id", authMiddleware, isAdmin, deleteBrand)
router.get("/:id", getaBrand)
router.get("/", getallBrand)

module.exports = router;
