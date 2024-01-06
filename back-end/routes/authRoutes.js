const express = require("express");
const {
    createUser,
    loginUserCtrl,
    getAllUsers,
    getSingalUser,
    deleteSingalUser,
    updateUser, 
    blockUser,
    unblockUser, 
    handleRefreshToken,
    logOut,
    updatePassword,
    forgotPasswordTaoken,
    resetPassword,
    loginAminCtrl,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    createOrder,
    removeProductFromCart,
    updateProdQntyInCart,
    getMyOrders,
    getYearlyTotalCount,
    getMonthWiseOrderIncom,
    getAllOrders, 
    getAOrders,
    updateOrderStatus}= require('../controller/userCtrl.js');
const {authMiddleware , isAdmin}= require("../middlewares/authMIddleware.js");
const {  payProduct, successPage } = require("../controller/paymentCntrl.js");
const router = express.Router();

router.post("/register" , createUser);
router.post("/forgot-password-Token" , forgotPasswordTaoken);
router.put("/reset-password/:token" , resetPassword);


router.put("/password" ,authMiddleware, updatePassword);
router.post("/login" , loginUserCtrl);
router.post("/admin-login" , loginAminCtrl);
router.post("/cart" ,authMiddleware, userCart);
router.post("/cart/create-order" ,authMiddleware, createOrder);
router.post("/order/payproduct" ,authMiddleware, payProduct);
router.post("/order/payproduct" ,authMiddleware, payProduct);
router.post("/order/successpage" , authMiddleware ,successPage);
router.put("/upate_order/:id" , authMiddleware , updateOrderStatus);


router.get("/cart" ,authMiddleware, getUserCart);
router.get("/getUsers" , getAllUsers);
router.get("/getmyorders" ,authMiddleware, getMyOrders);
router.get("/getallorders"  ,authMiddleware ,isAdmin, getAllOrders);
router.get("/getaorder/:id"  ,authMiddleware ,isAdmin, getAOrders);
router.get("/getmonthwiseorder-incom" ,authMiddleware, getMonthWiseOrderIncom);
router.get("/getyearlytotal-count" ,authMiddleware, getYearlyTotalCount);

router.get("/refresh" ,handleRefreshToken);
router.get("/logout" , logOut);
router.get("/whishlist"  ,authMiddleware , getWishlist);
router.get("/:id"  ,authMiddleware ,isAdmin, getSingalUser);


router.delete("/remove-product-cart/:cartItemId", authMiddleware , removeProductFromCart);
router.delete("/:id", deleteSingalUser);


router.put("/update/:cartItemId" , authMiddleware   , updateProdQntyInCart);
router.put("/edit-user" ,authMiddleware , updateUser);
router.put("/save-address" ,authMiddleware , saveAddress);
router.put("/block-user/:id" ,authMiddleware , isAdmin , blockUser);
router.put("/unblock-user/:id" ,authMiddleware , isAdmin , unblockUser);

module.exports=router;

