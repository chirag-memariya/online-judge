const mongoose = require('mongoose');
const ProblemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    statement: {
        type: String,
        required: true
    },
    input_output_sample: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy','medium','hard'],
        default: 'medium',
    }
});
module.exports= mongoose.model('Problem',ProblemSchema);
