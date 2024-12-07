import { verifyToken } from './token.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
