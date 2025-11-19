import { User } from '../models/user.model.js';
import { Portfolio } from '../models/portfolio.model.js';
import { Transaction } from '../models/transaction.model.js';

export const buyStock = async (req, res) => {
    const { symbol, quantity, price } = req.body;
    const userId = req.userId; // Comes from auth middleware

    if (!symbol || !quantity || !price) {
        return res.status(400).json({ message: 'Symbol, quantity, and price are required.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const totalCost = price * quantity;
        if (user.walletBalance < totalCost) {
            return res.status(400).json({ message: 'Insufficient funds.' });
        }

        user.walletBalance -= totalCost;
        await user.save();

        await Transaction.create({
            // Log the transaction
            userId,
            symbol,
            type: 'BUY',
            quantity,
            price,
            totalAmount: totalCost,
        });

        let portfolioItem = await Portfolio.findOne({ userId, symbol });
        if (portfolioItem) {
            const oldTotalValue = portfolioItem.averagePrice * portfolioItem.quantity;
            const newTotalValue = oldTotalValue + totalCost;
            const newQuantity = portfolioItem.quantity + quantity;

            portfolioItem.averagePrice = newTotalValue / newQuantity;
            portfolioItem.quantity = newQuantity;
            await portfolioItem.save();
        } else {
            portfolioItem = await Portfolio.create({
                userId,
                symbol,
                quantity,
                averagePrice: price,
            });
        }

        return res.status(200).json({
            message: `Successfully bought ${quantity} shares of ${symbol}`,
            newBalance: user.walletBalance,
            portfolio: portfolioItem,
        });

    } catch (error) {
        console.error('Error processing buy order:', error);
        return res.status(500).json({
            message: 'Buy Failed. Please try again later.',
            error: error.message,
         });
    }
};
