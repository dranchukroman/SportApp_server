import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = user;

    console.log(`[${new Date().toISOString()}] User: ${user.email} (ID: ${user.id}) accessed ${req.method} ${req.originalUrl}`);
    next();
  });
}
