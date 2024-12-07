import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import database from './users.js';
import { generateToken } from './token.js';

const SECRET_KEY = 'secretkey';

export const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });
  }

  try {
    const existingUser = database.getById(username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword };
    const savedUser = database.create(newUser);

    const token = generateToken(savedUser.id);

    return res.status(201).json({ message: 'Registration successful', token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong. Please try again.' });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });
  }

  try {
    const user = database.getById(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user.id);

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong. Please try again.' });
  }
};

export const getProfile = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Token is required for authentication.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    const userId = decoded.userId;
    const user = database.getById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      id: user.id,
      username: user.username,
    });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};
