const router = require("express").Router();
const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authToken } = require("./userAuth");

//Sign Up
router.post('/sign-up', async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        //check username length greater than 3
        if( username.length < 3) {
            return res
                .status(400)
                .json({message:" Username Length Should Be Greater Than 2"})
        }
        
        //check username exists already
        const existingUsername = await User.findOne({username: username})
        if(existingUsername){
            return res
                .status(400)
                .json({message:" Username Already Exists"})
        };

        //check email exists already
        const existingEmail = await User.findOne({email: email})
        if(existingEmail){
            return res
                .status(400)
                .json({message:" Email Already Exists"})
        }

        //check passwords length
        if( password.length < 6) {
            return res
                .status(400)
                .json({message:" Mininum Password- 6 Character"})
        }
        const hashPass = await bcrypt.hash(password, 5)

        const newUser = new User({
            username: username,
            email: email,
            password: hashPass ,
            address: address
        })
        await newUser.save()
        return res.status(200).json({message:"Sign Up Succesful"})

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error"} );
    }
})

//Sign In
router.post('/sign-in', async (req, res) => {
    try {
        const { username, password } = req.body

        const existingUser = await User.findOne({ username })
        if (!existingUser){
            res.status(400).json({ message: "Invalid Credential"})
        }
        await bcrypt.compare(password, existingUser.password, (err, data) => {
            if (data) {
                const authClaims = [
                    {name: existingUser.username},
                    {role: existingUser.role}
                ]
                const token = jwt.sign({authClaims}, "BookStore146", {
                    expiresIn: "10d"
                })
                res.status(200).json({ 
                    id: existingUser._id, 
                    role: existingUser.role, 
                    token: token})
            }
            else {
                res.status(400).json({ message: "Invalid Credentials"})
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error"} );
    }
})

//Get User Info
router.get("/user-info", authToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const data = await User.findById(id).select('-password');
        return res.status(200).json(data)
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

//update address
router.put("/update-address", authToken, async (req, res) =>{
    try {
        const {id} = req.headers;
        const {address} = req.body
        await User.findByIdAndUpdate(id, {address: address})
        return  res.status(200).json({message: "Address Updated Sucessfully"})
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})
module.exports = router;