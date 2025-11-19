import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    walletBalance: { 
        type: Number, 
        default: 1000000 // 10 Lakhs default
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
