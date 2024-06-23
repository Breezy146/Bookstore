const express = require("express");
const app = express();
require("dotenv").config();
require("./conn/connection")
const User = require("./routes/user")
const Books = require("./routes/book")
const Favourite = require("./routes/favourite")
const Cart = require("./routes/cart")
const Order = require("./routes/order")

app.use(express.json());
//routes
app.use("/api", User)
app.use("/api", Books)
app.use("/api", Favourite)
app.use("/api", Cart)
app.use("/api", Order)

//Port Creation
app.listen(process.env.PORT, () => {
    console.log(`Server Started ${process.env.PORT}`);
});

