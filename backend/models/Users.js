const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: Date
    },
    registration_date: {
        type: Date
    }
});

module.exports= mongoose.model('User',userSchema);