import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import { ApiError } from '../utils/api/ApiError.js';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new ApiError(401, 'Access token is required');
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      throw new ApiError(403, 'Invalid or expired token');
    }

    req.user = user;

    console.log(`[${new Date().toISOString()}] User: ${user.email} (ID: ${user.id}) accessed ${req.method} ${req.originalUrl}`);
    next();
  });
}
