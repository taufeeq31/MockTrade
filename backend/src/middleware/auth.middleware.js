import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'No token' });

    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Invalid token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
