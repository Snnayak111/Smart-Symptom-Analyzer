import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    disA: {
        type: Boolean,
        default: false,
    },
    disB: {
        type: Boolean,
        default: false,
    },
    disC: {
        type: Boolean,
        default: false,
    },
    disD: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

export default model('User', userSchema);