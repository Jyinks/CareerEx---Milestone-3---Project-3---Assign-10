const { raw, response } = require("express")
const Property = require("../models/propertyModel")
const User = require("../models/authModel")

const findProperties = async ()=>{
    
    const allProperties = await Property.find()

    return allProperties
}

const findUsers = async ()=>{

    const allUsers = await User.find()

    return allUsers
}
module.exports = {
    findProperties,
    findUsers
}