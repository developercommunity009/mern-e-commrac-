const express = require("express");
const { createCoupen, getAllCoupen, updateCoupen, deleteCoupen, getaCoupen } = require("../controller/coupenCntrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMIddleware");

const router = express.Router();


router.post("/" ,authMiddleware , isAdmin ,createCoupen);
router.get("/coupens" ,authMiddleware , isAdmin , getAllCoupen);
router.get("/coupen/:id" ,authMiddleware , isAdmin , getaCoupen);
router.put("/:id" ,authMiddleware , isAdmin , updateCoupen);
router.delete("/:id" ,authMiddleware , isAdmin , deleteCoupen);

module.exports= router;