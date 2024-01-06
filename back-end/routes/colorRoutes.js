const express = require("express");
const {
    createColor,
    updateColor,
    deleteColor,
    getaColor,
    getallColor } = require("../controller/colorCntrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMIddleware");
const router = express.Router();


router.post("/", authMiddleware, isAdmin, createColor)
router.put("/:id", authMiddleware, isAdmin, updateColor)
router.delete("/:id", authMiddleware, isAdmin, deleteColor)
router.get("/:id", getaColor)
router.get("/", getallColor)

module.exports = router;