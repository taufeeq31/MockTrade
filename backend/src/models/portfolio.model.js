import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    symbol: {
        type: String,
        required: true,
        uppercase: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    averagePrice: {
        type: Number,
        required: true,
        default: 0
    }, // Average price per share 
}, { timestamps: true });

// Ensure a user only has ONE portfolio entry per stock symbol
portfolioSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export const Portfolio = mongoose.model('Portfolio', portfolioSchema);
