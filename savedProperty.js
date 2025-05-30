
const mongoose = require("mongoose")

const savedPropertySchema = new mongoose.Schema({

    user_id: {type: String, require: true},
    property_id: {type: String, require: true},
    saved: {type: Boolean, default: true}
    
}, {timestamps: true})

const savedProperty = new mongoose.model("savedProperty", savedPropertySchema)

module.exports = savedProperty