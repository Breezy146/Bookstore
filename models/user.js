const mongoose = require('mongoose');
const user = new mongoose.Schema({
    username: {
        type: String,
        required:true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required:true
    },
    address: {
        type: String,
        required:true
    },
    avatar: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/2048px-User_icon_2.svg.png"
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    favourites: [{
        type: mongoose.Types.ObjectId, 
        ref: "books",
    }],
    cart: [{
        type: mongoose.Types.ObjectId, 
        ref: "books",
    }],
    orders: [{
        type: mongoose.Types.ObjectId, 
        ref: "order",
    }],
}, 
    {timestamp: true}
)
module.exports = mongoose.model("user", user)    