require('dotenv').config()
const mongoose = require("mongoose");

const uri = process.env.CLOUD

mongoose.connect(uri).then(() => {
	console.log("Database now connected...!");
});