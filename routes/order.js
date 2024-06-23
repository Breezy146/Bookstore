const router = require("express").Router()
const { authToken } = require("./userAuth")
const Book = require("../models/book")
const Order = require("../models/order")
const User = require("../models/user")

//place order
router.post("/place-order",authToken, async (req, res, next) => {
    try {
        const {id} =req.headers
        const {order} =req.body
        for (const orderData of order) {
            const newOrder = new Order({ user: id, book: orderData._id})
            const OrderDataFromDb = await newOrder.save()
            //saving order in user model
            await User.findByIdAndUpdate(id, {
                $push: { orders: orderDataFromDb._id}
            })
            //clearing cart
            await User.findByIdAndUpdate(id, {
                $pull: { cart: OrderDataFromDb._id}
            })
        }
        return res.json({
            status: "success",
            message: "Order placed successfully"
        })
         
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "An Error Occured (Ord)"})
    }
})

//get order history of particular user
router.get("/get-order-history",authToken, async (req, res, next) => {
    try {
        const { id } =req.headers
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book"}
        })
        const ordersData = userData.orders.reverse()
        return res.json({
            status: "Success",
            data: ordersData
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "An Error Occured (Ord)"})
    }
})

//get all orders - admin
router.get("/get-all-orders", authToken, async (req, res ) =>{
    try {
        const userData = await Order.find()
        .populate({
            path: "book",
        })
        .populate({
            path: "user"
        })
        .sort({ createdAt: -1 })
        return res.json({
            status: "Success",
            data: userData
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "An Error Occured (Ord)"})
    }
})

//update order - admin
router.put("/update-status/:id", authToken, async (req, res ) =>{
    try {
        const { id } = req.params
        await Order.findByIdAndUpdate(id, {status: req.body.status})
        return res.json({
            status: "Success",
            message: "Status Updated Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "An Error Occured (Ord)"})
    }
})

module.exports = router