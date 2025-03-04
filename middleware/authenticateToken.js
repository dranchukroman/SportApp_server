import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = user; // Додаємо користувача до запиту
    next();
  });
}
