const express = require("express");
const {
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getaEnquiry,
    getallEnquiry } = require("../controller/enqCntrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMIddleware");
const router = express.Router();


router.post("/", createEnquiry)
router.put("/:id", authMiddleware, isAdmin, updateEnquiry)
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry)
router.get("/:id", getaEnquiry)
router.get("/", getallEnquiry)

module.exports = router;