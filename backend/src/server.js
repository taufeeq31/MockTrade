import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import tradeRoutes from './routes/trade.routes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/trade', tradeRoutes); // Add this line

app.get('/', (req, res) => {
    res.json({ status: 'OK' });
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// 404 handler for unmatched routes
app.use((req, res, next) => {
    return res.status(404).json({ message: 'Wrong Route' });
});

app.use((err, req, res, next) => {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
});
