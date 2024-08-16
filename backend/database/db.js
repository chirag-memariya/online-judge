const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const DBConnection = async ()=>{
    const MONGODB_URL = process.env.MONGODB_URI;
    try {
        await mongoose.connect(MONGODB_URL,{
        });
        console.log("DB Connection established!");
    } catch (error) {
        console.error("Error!! while connection to MognoDB! : "+error);
    }
}

module.exports = {DBConnection};