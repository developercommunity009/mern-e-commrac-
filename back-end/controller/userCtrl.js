// const User =require("../models/userModel.js");
const User = require("../models/userModel")
const Cart = require("../models/cartModels")
const Product = require("../models/productModel")
const Coupen = require("../models/coupenModels")
const Order = require("../models/orderModels")
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validationMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEMail = require("./mailCtrl");
const crypto = require("crypto");





// create User
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        //Create a user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        // User al redy Exisit
        throw new Error("User Al Ready Exist!");;
    }
})


// Login User
const loginUserCtrl = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    console.log(email, password)
    const findUser = await User.findOne({ email });

    if (findUser && (await findUser.isPasswordMatched(password))) {

        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(findUser.id,
            { refreshToken: refreshToken }, { new: true });

        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 72 * 60 * 60 * 1000 });

        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?.id)
        });
    } else {
        throw new Error("Invalid Crentials!")
    }
});



// Admin Login


const loginAminCtrl = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== "admin") throw new Error("Not Authorization")
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {

        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updateAdmin = await User.findByIdAndUpdate(findAdmin.id,
            { refreshToken: refreshToken }, { new: true });

        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 72 * 60 * 60 * 1000 });

        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?.id),

        });
    } else {
        throw new Error("Invalid Crentials!")
    }
})


//  save User Address

const saveAddress = asyncHandler(async (req, res, next) => {

    const { _id } = req.user;
    validationMongoDbId(_id)

    try {
        const updateUser = await User.findByIdAndUpdate(_id, {
            address: req?.body?.address

        }, { new: true });
        res.json(updateUser)
    } catch (error) {
        throw new Error(error);
    }
})



// Get All User
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
})

// Get a Sengale User
const getSingalUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validationMongoDbId(id);
    try {
        const getSingalUser = await User.findById(id);
        res.json({
            getSingalUser
        })
    } catch (error) {
        throw new Error(error);
    }
})



// Delete A user
const deleteSingalUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validationMongoDbId(id);
    try {
        const deleteSingalUser = await User.findByIdAndDelete(id);
        res.json({
            msg: "Delete User Successfuly"
        })
    } catch (error) {
        throw new Error(error);
    }
})


// handle refresh Token

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");

    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });

    if (!user) throw new Error("No Refresh Token present in db or not match!")
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("there is something wrong with refresh token")
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    })
})


// logOut functionality

const logOut = asyncHandler(async (req, res) => {

    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error(" No Refresh Token in cookie");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });

    if (!user) {
        console.log("logout");
        res.clearCookie("refreshToken", { httpOnly: true, secure: true });

        return res.sendStatus(204); // forbidden
    }
    await User.findOneAndUpdate(refreshToken, { refreshToken: "" });

    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    res.sendStatus(204); // forbidden
})


// Update A user
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validationMongoDbId(_id)

    try {
        const updateUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        }, { new: true });
        res.json(updateUser)
    } catch (error) {
        throw new Error(error);
    }
})



//block User
const blockUser = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validationMongoDbId(id);
    try {
        const block = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true })
        res.json({ message: "User Blocked!" })
    } catch (error) {
        throw new Error(error);
    }
})



//Unblock User
const unblockUser = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validationMongoDbId(id);

    try {
        const unblock = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true })
        res.json({ message: " User is Unblocked!" })
    } catch (error) {
        throw new Error(error);
    }

})


// updatePassword

const updatePassword = asyncHandler(async (req, res) => {

    const { _id } = req.user;
    const { password } = req.body;
    validationMongoDbId(_id);

    const user = await User.findById(_id);

    if (password) {
        user.password = password;
        const updatePassword = await user.save();
        res.json(updatePassword);
    } else {
        res.json(user);
    }

})


const forgotPasswordTaoken = asyncHandler(async (req, res) => {

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error(" User not found with this email");
    try {
        const token = await user.createPasswordResetToken();
        console.log(user);
        await user.save();
        const resetURL = `Hi ,Pleace follow this link to reset Your Password .
         This link is valid till 10 minutes from now . <a href='http://localhost:3000/reset-password/${token}'>Click Here />`

        const data = {
            to: email,
            text: "Hey User",
            subject: " Forget Password link",
            html: resetURL
        }
        sendEMail(data);
        res.json(token)
    } catch (error) {
        throw new Error(error);
    }
})


const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashededToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashededToken,
        passwordResetExpires: { $gt: Date.now() },

    });
    if (!user) throw new Error(" Token Expred , Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
})


const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const getUser = await User.findById(_id).populate("wishlist");
        res.json(getUser);
    } catch (error) {
        throw new Error(error);
    }
})




const userCart = asyncHandler(async (req, res) => {
    const { productId, price, quantity, color } = req.body;
    const { _id } = req.user;
    validationMongoDbId(_id);

    try {
        //         {
        //     //     let products = [];
        //     //     const user = await User.findById(_id);

        //     //     // user if have ALready in Cart

        //     //     const alreadyExistUser = await Cart.findOne({orderby: user.id})

        //     //      if(alreadyExistUser){
        //     //       alreadyExistUser.remove();
        //     //      }

        //     //      for(let i = 0; i < cart.length; i++){
        //     //         let object= {};
        //     //         object.product = cart[i]._id;
        //     //         object.count = cart[i].count;
        //     //         object.color = cart[i].color;

        //     //         let getPrice = await Product.findById(cart[i]._id).select("price").exec();
        //     //         object.price = getPrice.price;
        //     //         products.push(object)
        //     //      }
        //     //      let cartTotal = 0;
        //     //      for (let i = 0 ; i < products.length ; i++){
        //     //          cartTotal = cartTotal + products[i].price * products[i].count;
        //     //      }
        //   }
        let newCard = await new Cart({
            userId: _id,
            productId,
            price,
            quantity,
            color
        }).save();
        res.json(newCard);

    } catch (error) {
        throw new Error(error)
    }
})

const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validationMongoDbId(_id);

    try {
        const cart = await Cart.find({ userId: _id }).populate("productId").populate("color");
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
})

const removeProductFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { cartItemId } = req.params;
    validationMongoDbId(_id);
    try {
        const removeProd = await Cart.deleteOne({ _id: cartItemId, userId: _id, });
        res.json(removeProd);
    } catch (error) {
        throw new Error(error);
    }
})


const updateProdQntyInCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { cartItemId } = req.params;
    const { newQuantity } = req.body;
    validationMongoDbId(_id);
    try {
        const updateQty = await Cart.findOne({ _id: cartItemId, userId: _id, });
        updateQty.quantity = newQuantity;
        updateQty.save();
        res.json(updateQty);
    } catch (error) {
        throw new Error(error);
    }
})

const createOrder = asyncHandler(async (req, res) => {

    const {
        shippingInfo,
        paymentInfo,
        oderItem,
        totalPrice,
        totalPriceAfterDiscount } = req.body;
    const { _id } = req.user;

    try {
        const order = await Order.create({
            shippingInfo,
            paymentInfo,
            oderItem,
            totalPrice,
            totalPriceAfterDiscount,
            user: _id
        })
        res.json({
            order,
            success: true
        });

    } catch (error) {
        throw new Error(error);
    }
})


const getMyOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validationMongoDbId(_id);
    try {
        const orders = await Order.find({ user: _id })
            .populate("user")
            .populate("oderItem.product")
            .populate("oderItem.color");
        res.json({ orders });
    } catch (error) {
        throw new Error(error);
    }
})

const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find().populate("user")
        res.json({ orders })
    } catch (error) {
        throw new Error(error);
    }
})


const getAOrders = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const orders = await Order.findOne({ _id: id }).populate("oderItem.product").populate("oderItem.color")
        res.json({ orders })
    } catch (error) {
        throw new Error(error);
    }
})



const getMonthWiseOrderIncom = asyncHandler(async (req, res) => {

    let monthsName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let d = new Date(); // now
    let endDate = "";
    d.setDate(1);

    for (let index = 0; index < 11; index++) {
        d.setMonth(d.getMonth() - 1);
        endDate = monthsName[d.getMonth()] + " " + d.getFullYear();
    }
    // console.log(endDate);

    const data = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $lte: new Date(),
                    $gte: new Date(endDate)
                }
            }
        },
        {
            $group: {
                _id: {
                    month: "$month"
                },
                amount: {
                    $sum: "$totalPriceAfterDiscount"
                }, count: {
                    $sum: 1
                }
            }
        }
    ])
    console.log(data)
    res.json(data)
})



const getYearlyTotalCount = asyncHandler(async (req, res) => {

    let monthsName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let d = new Date(); // now
    let endDate = "";
    d.setDate(1);

    for (let index = 0; index < 11; index++) {
        d.setMonth(d.getMonth() - 1);
        endDate = monthsName[d.getMonth()] + " " + d.getFullYear();
    }
    // console.log(endDate);

    const data = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $lte: new Date(),
                    $gte: new Date(endDate)
                }
            }
        },
        {
            $group: {
                _id: null,
                count: {
                    $sum: 1
                },
                amount: {
                    $sum: "$totalPriceAfterDiscount"
                }

            }
        }
    ])
    console.log(data)
    res.json(data)
})


const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validationMongoDbId(id);

    try {
        const order = await Order.findById(id);
        order.orderStatus = req.body.status
        await order.save();
        res.json(order);
    } catch (error) {
        throw new Error(error);
    }
})





















//==================================================================================================================================
//    RE-USEABLE FUNCTIONS
//==========================================
//   const emptyCart = asyncHandler(async (req, res) => {
//     const { _id } = req.user;
//     validationMongoDbId(_id);
//     try {
//         const user = await User.findOne({ _id });
//         const cart = await Cart.findOneAndRemove({ orderby: user._id });
//         res.json(cart);
//     } catch (error) {
//         throw new Error(error);
//     }
// })

// const applyCoupon = asyncHandler(async (req, res) => {
//     const { coupen } = req.body;
//     const { _id } = req.user;
//     validationMongoDbId(_id);

//     const validCoupen = await Coupen.findOne({ name: coupen })
//     if (validCoupen === null) {
//         throw new Error(" Invalid Coupen");
//     } else if (validCoupen.expiry < Date.now()) {
//         throw new Error("Coupen  Expired");
//     }

//     const user = await User.findOne({ _id });
//     let { products, cartTotal } = await Cart.findOne({
//         orderby: user._id,
//     }).populate("products.product");

//     let totalAfterDiscount = (
//         cartTotal - (cartTotal * validCoupen.discount) / cartTotal
//     ).toFixed(2);

//     const totalAfterDisco = await Cart.findOneAndUpdate(
//         { orderby: user._id },
//         { totalAfterDiscount },
//         { new: true }
//     )
//     // res.json(totalAfterDiscount)
//     res.json(totalAfterDisco)
// })


// const createOrder = asyncHandler(async (req, res) => {
//     const { COD, coupenApplied } = req.body;
//     const { _id } = req.user;
//     validationMongoDbId(_id);
//     try {
//         if (!COD) throw new Error("Create cash order failed")
//         const user = await User.findById(_id);
//         const userCart = await Cart.findOne({ orderby: user._id });
//         let findAmount = 0;
//         if (coupenApplied && userCart.totalAfterDiscount) {
//             findAmount = userCart.totalAfterDiscount;
//         } else {
//             findAmount = userCart.cartTotal;
//         }

//         let newOrder = await new Order({
//             products: userCart.products,
//             paymentIntent: {
//                 id: uniqid(),
//                 method: "COD",
//                 amount: findAmount,
//                 status: "Cash On Delevery",
//                 created: Date.now(),
//                 currency: "USD",
//             },
//             orderby: user._id,
//             orderStatus: "Cash on Delevery"
//         }).save();

//         let update = userCart.products.map((item) => {
//             return {
//                 updateOne: {
//                     filter: { _id: item.product._id },
//                     update: { $inc: { quantity: -item.count, sold: +item.count } },
//                 },
//             };
//         })


//         const updated = await Product.bulkWrite(update, {})
//         res.json({ message: "Success", update })
//     } catch (error) {
//         throw new Error(error);
//     }

// })


// const getOrders = asyncHandler(async (req, res) => {
//     const { _id } = req.user;
//     validationMongoDbId(_id);

//     try {
//         const userOrders = await Order.findOne({ orderby: _id })
//             .populate('products.product').populate('orderby')
//             .exec();
//         res.json(userOrders);

//     } catch (error) {
//         throw new Error(error);
//     }
// })

// const getOrderByUserId = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     validationMongoDbId(id);
//     try {
//         const userorders = await Order.findOne({ orderby: id })
//             .populate("products.product")
//             .populate("orderby")
//             .exec();
//         res.json(userorders);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// const getAllOrders = asyncHandler(async (req, res) => {
//     try {
//         const alluserOrders = await Order.find()
//             .populate('products.product').populate('orderby')
//             .exec();
//         res.json(alluserOrders);

//     } catch (error) {
//         throw new Error(error);
//     }
// })




//==================================================================================================================================



module.exports =
{
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
    removeProductFromCart,
    updateProdQntyInCart,
    createOrder,
    getMyOrders,
    getMonthWiseOrderIncom,
    getYearlyTotalCount,
    getAllOrders,
    getAOrders,
    updateOrderStatus


    // emptyCart,
    // applyCoupon,
    // createOrder,
    // getOrders,
    // getOrderByUserId,
};
