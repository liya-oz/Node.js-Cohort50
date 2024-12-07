import jwt from 'jsonwebtoken';

const secretKey = 'your-secret-key';

export const generateToken = (userId) => {
  if (!secretKey) {
    throw new Error('Secret key is missing');
  }

  return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  if (!token) {
    throw new Error('Token is required for verification');
  }

  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired. Please log in again.');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token. Please log in again.');
    }
    throw new Error('Token verification failed.');
  }
};
