const router = require("express").Router()
const User = require("../models/user")
const { authToken } = require("./userAuth")

//put book to cart
router.put("/add-book-to-cart", authToken, async ( req, res) => {
    try {
        const {bookid, id} = req.headers
        const userData = await User.findById(id)
        const inCart = userData.cart.includes(bookid)
        if(inCart) {
        return res.status(200).json({ message: "Already In Cart"} );
        }
        await User.findByIdAndUpdate(id, {$push: { cart: bookid }})
        return res.status(200).json({ 
            status: "Success",
            message: "Book Added To Cart"} );
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error (cart)"} );
    }
})

//remove book from cart
router.put("/remove-from-cart/:bookid", authToken, async ( req, res) => {
    try {
        const {bookid} = req.params
        const {id} = req.headers
        await User.findByIdAndUpdate(id, {
            $pull: { cart: bookid }
    })
    return res.status(200).json({ 
        status: "Success",
        message: "Book Removed From Cart"
    });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error (cart)"} );
    }
})

//get cart of a particular user
router.get("/get-cart-of/:bookid", authToken, async ( req, res) => {
    try {
        const {id} = req.headers
        const userData = await User.findById(id).populate("cart")
        const cartBooks = userData.cart
        return res.json({
            status: "Success",
            data: cartBooks,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error (cart)"} );
    }
})

module.exports = router