
const mongoose = require("mongoose");

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MongoURL);
        console.log('You are connected');
    } catch (error) {
        console.log(error); 
    }
};

module.exports = connectdb;
