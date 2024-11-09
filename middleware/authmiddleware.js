import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
    // Get the authorization header
    const authHeader = req.headers['authorization'];
    
    // Bearer TOKEN format - split and get the token
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token+" using middelware")

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}