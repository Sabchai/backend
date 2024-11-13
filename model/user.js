
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    Name: { type: String },
    userName: { type: String },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Address: { type: String, required: true },
    Phone: { type: String, required: true },  
    Role: { type: String, default: "user" }
});

module.exports = mongoose.model("User", userSchema);
