const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    name : {
        type: String,
        trim: true,
        default: '',
    },
    location : {
        type: String,
        trim: true,
        default: '',
    },
    device_id: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password : {
        type: String,
        trim: true,
        required: true,
    },
    data: [
            {
                light: {
                    type: Boolean,
                    required: true,
                },
                pir: {
                    type: Boolean,
                    required: true,
                },
                load: {
                    type: Boolean,
                    required: true,
                },
                override: {
                    type: Boolean,
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
    ]
    
},{timestamps: true});

module.exports = mongoose.model('Device', deviceSchema)