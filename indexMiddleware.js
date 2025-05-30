const User = require("../models/authModel")
const jwt = require("jsonwebtoken")

const validateRegistration = (req, res, next)=>{

     const { email, password, firstName, lastName, location, role } = req.body
     const errors = []

     if(!email){
        errors.push("Please enter your email")
    }

    if(!password){
    errors.push("Please enter your password")
    }

    if(errors.length>0){
        return res.status(400).json({message: errors})
    }

    next()

}

const validateProperties = (req, res, next)=>{
const errors = []
        const { title, price, location, image, agent } = req.body

        if(!title){
           errors.push("Please enter the title")
        }

        if(!price){
            errors.push("Please enter the price")
        }

        if(!location){
            errors.push("Please enter the location")
        }

        if(!agent){
           errors.push("Please enter Agent's name")
        }

        if(errors.length>0){
            return res.status(400).json({message: errors})
        }
        next()
    }

    const authorization = async (req, res, next)=>{

        const token = req.header("Authorization")

        if(!token){
            return res.status(402).json({message: "Please Login!"})
        }

        const splitToken = token.split(" ")  //To seperate the 'bearer' keyword from the actual token
        
        const realToken = splitToken[1]      //To select the actual token you need

        const decoded = jwt.verify(realToken, `${process.env.ACCESS_TOKEN}`)      //To verify that the token has your access token inside it.

        if(!decoded){
            return res.status(402).json({message: "Please Login!"})
        }

        const user = await User.findById(decoded.id)

        if(!user){
            return res.status(402).json({message: "User Account Does Not Exist"})
        }

        //To ensure permissions only for agents (specifically those who can create or post properties)
        if(user?.role != "agent"){
            return res.status(402).json({message: "Invalid Authorization"})
        }

        req.user = user

        next()
    }


module.exports = {
    validateRegistration,
    validateProperties,
    authorization
}