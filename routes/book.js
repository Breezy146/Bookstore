const router = require("express").Router()
const User = require("../models/user")
const Book = require("../models/book")
const { authToken } = require("./userAuth") 

//add book admin
router.post("/add-book", authToken, async (req, res) => {
    try {
        const {id} = req.headers
        const user = await User.findById(id)
        if( user.role !== "admin"){
            return res.status(400).json({message: "Admin Access Only"})
        }
        const book = new Book({
            url: req.body.url ,
            title: req.body.title ,
            author: req.body.author ,
            price: req.body.price ,
            desc: req.body.desc ,
            lang: req.body.lang
        })
        await book.save();
        res.status(200).json({message: "Book Added Successfully"})
    } catch (error) {
        res.status(500).json({message: "Internal Server Error(b)"})
    }
})

//update book
router.put("/update-book", authToken, async (req, res) => {
    try {
        const {bookid} = req.headers
        await Book.findByIdAndUpdate(bookid, {
            url: req.body.url ,
            title: req.body.title ,
            author: req.body.author ,
            price: req.body.price ,
            desc: req.body.desc ,
            lang: req.body.lang
        })
        return res.status(200).json({message: "Book Updated Successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Book Update Error Occured"})
    }
})

//delete book
router.delete("/delete-book", authToken, async (req, res) => {
    try {
        const {bookid} = req.headers
        await Book.findByIdAndDelete(bookid)
        return res.status(200).json({message: "Book Deleted Successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Book Delete Error Occured"})
    }
})

//Get All Books
router.get("/get-all-books", async (req, res) => {
    try {
        const books = await Book.find().sort({createdAt: -1})
        return res.json({
            status: "Success",
            data: books
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Fetch  Error Occured"})
    }
})

//get recent books 
router.get("/get-recent-books", async (req, res) => {
    try {
        const books = await Book.find().sort({createdAt: -1}).limit(4)
        return res.json({
            status: "Success",
            data: books
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Fetch Error Occured"})
    }
})

//get book by id
router.get("/get-book-by-id/:id", async (req, res) => {
    try {
        const {id} = req.params
        const books = await Book.findById(id)
        return res.json({
            status: "Success",
            data: books
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Fetch Error Occured"})
    }
})
module.exports = router