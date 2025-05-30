const User = require("../models/authModel")
const Property = require("../models/propertyModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { findProperties, findUsers } = require("../service/indexService")
const savedProperty = require("../models/savedProperty")
const resetPasswordEmail = require("../sendMail")
const { authorization } = require("../middleware/indexMiddleware")

//Test Server
const handleTestServer = (req, res)=>{
    res.status(200).json({message: 'Welcome to CareerEx Server'})
}

// POST/auth/register
const handleRegistration = async (req, res)=>{

try{

    const { email, password, firstName, lastName, location, role } = req.body

    const existingUser = await User.findOne({email})

    if(existingUser){
    return res.status(400).json({message: "User account already exists."})
    }

    if(password.length < 8){
    return res.status(400).json({message: "Password should be a minimum of 8 characters."})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
          email,
          password: hashedPassword , 
          firstName, 
          lastName, 
          location, 
          role 
        })

        await newUser.save()
    
    res.status(201).json({
        message: "User account created successfully",
        newUser: { email, firstName, lastName, location, role}  //This is to specify the data you wish to send out.
    })

}  catch (error) {
    res.status(500).json({message: error.message})
}
}

// POST/auth/login
const handleLogin = async (req, res)=>{

    try {
        const { email, password } = req.body

        const user = await User.findOne({email})

        if(!user){
            return res.status(404).json({message: "User account does not exist"})
        }

        const isRight = await bcrypt.compare(password, user?.password)

        if(!isRight){
            return res.status(400).json({message: "Incorrect email or password"})
        }

        const accessToken = jwt.sign(
            {id: user?._id},
            process.env.ACCESS_TOKEN,
            {expiresIn: "5h"}
        )

        const refreshToken = jwt.sign(
            {id: user?._id},
            process.env.REFRESH_TOKEN,
            {expiresIn: "30d"}
        )

        res.status(200).json({
            message: "Login Successful",
            accessToken,
            user: {
                email: user?.email,
                firstName: user?.firstName,
                lastName: user?.lastName,
                location: user?.location,
                role: user?.role
            },
            refreshToken
        })

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// POST/Forgot Password
const handleForgotPassword = async (req, res)=>{

    try{

        const { email } = req.body

        const user = await User.findOne({ email })
        if(!user){
          return  res.status(404).json({message: "User Not Found"})
        }
        
        const accessToken = await jwt.sign(

            {user},
            `${process.env.ACCESS_TOKEN}`,
            {expiresIn: "5m"}
        )
        await resetPasswordEmail(email, "")

        res.status(200).json({message: "Please Check Your Email"})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// PATCH/Reset Password
const handleResetPassword =  async (req, res)=>{
    try{

    const { email, password } = req.body

    const user = await User.find({email})

    if(!user){
          return  res.status(404).json({message: "User Not Found"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword

        await user.save()
        
        res.status(200).json({message: "Password Reset Successful"})

} catch(error) {
    res.status(500).json({message: error.message})
}
}

// POST/properties(agent)
const handleProperties = async (req, res)=>{
    
     try{

        const { title, price, location, image, agent } = req.body

        const newProperty = new Property({ title, price, location, image, agent })

        await newProperty.save()

        res.status(201).json({
            message: "Added Successfully",
            newProperty
        })

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// GET/users
const handleAllUsers = async (req, res)=>{

    try{

        const allUsers = await findUsers()

        res.status(200).json({
            message: "Successful",
            allUsers
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// GET/properties
const handleAllProperties = async (req, res)=>{

    try{

        const allProperties = await findProperties()

        res.status(200).json({
            message: "Successful",
            allProperties
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// GET/properties/:id
const handleOneProperty = async (req, res)=>{

    try{

        const { id } = req.params

        const property = await Property.findById(id)
        
        if(!property){
            return res.status(404).json({message: "Property Not Found"})
        }
        res.status(200).json({
            message: "Successful",
            property
        })

     } catch (error) {
        req.status(500).json({message: error.message})
    }
}

// DELETE/Property
const handleDeletedProperties = async (req, res)=>{

    try{
    const { id } = req.body

    const deletedProperty = await Property.findByIdAndDelete(id)

    res.status(200).json({message: "Successful"})
} catch (error) {
    res.status(500).json({message: error.message})
}
}

// DELETE/user
const handleDeletedUsers = async (req, res)=>{

    try{

    const { id } = req.body

    const deletedUser = await User.findByIdAndDelete(id)

    res.status(200).json({message: "Successful"})

} catch (error) {
    res.status(500).json({message:error.message})
}
}

// POST/saved
const handleSavedProperty = async (req, res)=>{

    try{
        
        const { user_id, property_id } = req.body
        const favoriteProperty = new savedProperty({ user_id, property_id})
        favoriteProperty.save()

        res.status(201).json({
            message: "Saved",
            favoriteProperty
        })

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// GET/saved


module.exports = {
    handleTestServer,
    handleRegistration,
    handleLogin,
    handleForgotPassword,
    handleResetPassword,
    handleProperties,
    handleAllUsers,
    handleAllProperties,
    handleOneProperty,
    handleDeletedProperties,
    handleDeletedUsers,
    handleSavedProperty
}
