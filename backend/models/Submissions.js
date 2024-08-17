const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    verdict: {
        type: String,
        enum: ['Accepted','Wrong Answer','Compilation Error','Runtime Error'],
        required: true
    },
    solution:{
        type: String,
        required: true
    },
    submitted_at:{
        type: Date,
        default: Date.now
    },
    execution_time:{
        type: Number //(in ms)
    }
});
module.exports= mongoose.model('Submission',SubmissionSchema);