
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    email: {type: String, require: true},
    password: {type: String, require: true},
    firstName: {type: String, default: ""},
    lastName: {type: String, default: ""},
    location: {type: String, default: ""},
    role: {type: String, default: "user"}
    
}, {timestamps: true})

const User = new mongoose.model("User", userSchema)

module.exports = User