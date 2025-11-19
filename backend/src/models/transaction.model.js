import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        symbol: {
            type: String,
            required: true,
            uppercase: true,
        }, // e.g., "RELIANCE", "AAPL"
        type: {
            type: String,
            enum: ['BUY', 'SELL'],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
        }, // Price per share at moment of trade
        totalAmount: {
            type: Number,
            required: true,
        }, // quantity * price
    },
    { timestamps: true }
);

export const Transaction = mongoose.model('Transaction', transactionSchema);
