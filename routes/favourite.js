const router = require("express").Router()
const User = require("../models/user")
const { authToken } = require("./userAuth") 

//add book to favourites
router.put("/add-book-to-fav", authToken, async ( req, res) => {
    try {
        const {bookid, id} = req.headers
        const userData = await User.findById(id)
        const isBookFav = userData.favourites.includes(bookid)
        if(isBookFav) {
        return res.status(200).json({ message: "Already In Favourites"} );
        }
        await User.findByIdAndUpdate(id, {$push: { favourites: bookid }})
        return res.status(200).json({ message: "Book Added To Favourites"} );
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error (fav)"} );
    }
})

//delete book from favourites
router.put("/remove-book-from-fav", authToken, async ( req, res) => {
    try {
        const {bookid, id} = req.headers
        const userData = await User.findById(id)
        const isBookFav = userData.favourites.includes(bookid)
        if(isBookFav) {
            await User.findByIdAndUpdate(id, {$pull: { favourites: bookid }})
        }
        return res.status(200).json({ message: "Book Removed From Favourites"} );
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error (fav)"} );
    }
})

//get fav book of a particular user
router.get("/get-fav-book", authToken, async ( req, res) => {
    try {
        const {id} = req.headers
        const userData = await User.findById(id).populate("favourites")
        const favBooks = userData.favourites
        return res.json({
            status: "Success",
            data: favBooks,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error (fav)"} );
    }
})
module.exports = router