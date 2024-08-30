const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({
problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    cases: [
        {
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            }
        }
    ]
});
module.exports= mongoose.model('TestCase',TestCaseSchema);