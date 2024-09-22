import jwt from 'jsonwebtoken'
export function authenticateToken(req, res, next) {
    const token = req.cookies.token; 

    if (!token) {
        return res.sendStatus(401); 
    }
    jwt.verify(token, "playpowerlabs_backend", (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user; 
        next(); 
    });
}
