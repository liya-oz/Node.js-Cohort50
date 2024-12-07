import newDatabase from './database.js';
import bcrypt from 'bcrypt';

const isPersistent = true;
const database = newDatabase({ isPersistent });

export const createUser = async (username, password) => {
  if (!username || !password) {
    throw new Error('Username and password are required.');
  }

  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();

  const existingUser = await getUserByUsername(trimmedUsername);
  if (existingUser) {
    throw new Error('Username is already taken.');
  }

  const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

  const newUser = {
    username: trimmedUsername,
    password: hashedPassword,
    id: Date.now(),
  };

  return await database.create(newUser);
};

export const getUserById = async (id) => {
  if (!id) throw new Error('User ID is required.');

  try {
    return await database.getById(id);
  } catch (error) {
    throw new Error('Error retrieving user by ID.');
  }
};

export const getUserByUsername = async (username) => {
  if (!username) throw new Error('Username is required.');

  try {
    return await database.getById(username.trim());
  } catch (error) {
    throw new Error('Error retrieving user.');
  }
};

export const validateUserCredentials = async (username, password) => {
  if (!username || !password) {
    return { isValid: false, message: 'Username and password are required.' };
  }

  const user = await getUserByUsername(username);
  if (!user) {
    return { isValid: false, message: 'Invalid credentials.' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { isValid: false, message: 'Invalid credentials.' };
  }

  return { isValid: true, user };
};

export default database;
