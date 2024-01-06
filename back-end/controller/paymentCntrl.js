const paypal = require('paypal-rest-sdk');
const Order = require("../models/orderModels");

paypal.configure({
    'mode': "sandbox",
    'client_id': "AetnnAvjRNMwXTJj8XU1upEq-SNFgz60wE7JOJW2rvbQG4rWSQS-3uoztRYr9o0l_PJ6ygkmpOB7LAuf",
    'client_secret': "ELbh1uyQq7FCB26ziU-MvNA9T00TNPnqbU3eytdj23pWicEoECU6Wdc7SUBIIGYqMJ9uR6ZAn2sH6q_8"
});



const payProduct = async (req, res) => {

    try {

        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal",
                "payer_info": {
                    "first_name": `${req.body.shippingInfo.firstname}`,
                    "last_name": `${req.body.shippingInfo.lastname}`,
                    "billing_address": {
                        "line1": `${req.body.shippingInfo.country}`,
                        "city": `${req.body.shippingInfo.city}`,
                        "state": `${req.body.shippingInfo.state}`,
                        "postal_code": `${req.body.shippingInfo.pincode}`,
                        "country_code": "IN",
                    }
                }
            },
            "redirect_urls": {
                "return_url": "http://localhost:3000/success",
                "cancel_url": "http://localhost:3000/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": `${req.body.cartState[0].productId.title}`,
                        "sku": `${req.body.cartState[0].productId._id}`,
                        "price": `${req.body.cartState[0].price}`,
                        "currency": "USD",
                        "quantity": `${req.body.cartState[0].quantity}`,
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": `${req.body.totalAmount}`
                },
                "description": `${req.body.cartState[0].color._id}`,
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {

                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        res.send(payment.links[i].href);
                    }
                }
            }
        });

    } catch (error) {
        console.log(error.message);
    }

}

const successPage = async (req, res) => {

    try {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const { amount } = req.body;

        console.log(payerId)
        console.log(paymentId)
        console.log(amount)

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": amount
                }
            }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                    const shippingInfo = {
                        firstname: payment.payer.payer_info.first_name,
                        lastname: payment.payer.payer_info.last_name,
                        address: payment.payer.payer_info.billing_address.city,
                        city: payment.payer.payer_info.billing_address.city,
                        state: payment.payer.payer_info.billing_address.state,
                        country: payment.payer.payer_info.billing_address.line1,
                        pincode: payment.payer.payer_info.billing_address.postal_code
                    }
                    const paymentInfo = {
                        cartNo: payment.cart,
                        cartId: paymentId
                    }
                    const oderItem = {
                        product: payment.transactions[0].item_list.items[0].sku,
                        color: payment.transactions[0].description,
                        quantity: payment.transactions[0].item_list.items[0].quantity,
                        price: payment.transactions[0].item_list.items[0].price
                    }
                    const totalPrice = payment.transactions[0].amount.total;
                    const totalPriceAfterDiscount = payment.transactions[0].amount.total;
                    const user = req.user;

                   Order.create({
                        shippingInfo,
                        paymentInfo,
                        oderItem,
                        totalPrice,
                        totalPriceAfterDiscount,
                        user
                    })
                
                
                res.json({
                    status: true,
                    payment
                });
             
            }
        });


    } catch (error) {
        console.log(error.message);
    }

}





const cancelPage = async (req, res) => {

    try {

        res.json("Cancel");

    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    payProduct,
    successPage,
    cancelPage
}