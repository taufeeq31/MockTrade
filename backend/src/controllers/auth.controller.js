import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format', success: false });
        }

        // Password length validation
        if (password.length < 6) {
            return res
                .status(400)
                .json({ message: 'Password must be at least 6 characters', success: false });
        }

        const exist = await User.findOne({ email }); // Check if user already exists
        if (exist) {
            return res.status(400).json({
                message: 'User Already exists',
                success: false,
            });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed }); // Create new user

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Server misconfigured: missing JWT secret' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return res.status(201).json({
            user: { id: user._id, name: user.name, email: user.email },
            token,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Signup failed',
            success: false,
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body; // Taking Email, Password
        if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

        const user = await User.findOne({ email }); // Find user by email
        if (!user) return res.status(400).json({ message: 'User not found! Please SignUp' });

        const match = await bcrypt.compare(password, user.password); // Compare passwords
        if (!match) return res.status(400).json({ message: 'Invalid password' });

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Server misconfigured: missing JWT secret' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        return res.status(200).json({
            user: { id: user._id, name: user.name, email: user.email },
            token,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
