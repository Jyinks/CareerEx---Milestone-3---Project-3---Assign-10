
const express = require("express")
const { handleTestServer, handleRegistration, handleLogin, handleProperties, handleForgotPassword, handleResetPassword, handleAllUsers, handleAllProperties, handleOneProperty, handleDeletedProperties, handleDeletedUsers, handleSavedProperty } = require("../Conrollers")
const { validateRegistration, validateProperties, authorization } = require("../middleware")

const router = express.Router()

router.get("/", handleTestServer)

router.post("/register", validateRegistration, handleRegistration)

router.post("/login", handleLogin)

router.post("/new-property", validateProperties, handleProperties)

router.post("/forgot-password", handleForgotPassword )

router.patch("/reset-password", authorization, handleResetPassword)

router.get("/all-users", authorization, handleAllUsers)

router.get("/all-properties", handleAllProperties)

router.get("/one-property/:id", handleOneProperty)

router.delete("/delete-property", handleDeletedProperties)

router.delete("/delete-user", handleDeletedUsers)

router.post("/save-property", handleSavedProperty)



module.exports = router