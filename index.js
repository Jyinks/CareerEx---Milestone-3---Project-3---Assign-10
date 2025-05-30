
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("./models/authModel")
const Property = require("./models/propertyModel")
const cors = require("cors")
const routes = require("./Routes")
dotenv.config()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 7000

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("MONGODB Connected....")

    app.listen(PORT, ()=>{
        console.log(`Server running on ${PORT}`)
    })
})

app.use(routes)

// GET/saved