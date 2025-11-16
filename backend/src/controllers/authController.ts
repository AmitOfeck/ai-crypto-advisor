import { Request, Response } from 'express';
import { CreateUserData, LoginCredentials } from '../models/UserTypes';
import { createUser, validateUser } from '../services/authService';

// TODO: Add JWT token generation
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData: CreateUserData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    // Input validation is handled by middleware
    const newUser = await createUser(userData);

    // TODO: Generate JWT token
    // TODO: Return token to client
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    // Handle duplicate email error (MongoDB unique constraint)
    if (error.code === 11000 || error.keyPattern?.email) {
      res.status(409).json({ error: 'Email already exists' });
      return;
    }
    // TODO: Add proper error handling for other errors
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// TODO: Add JWT token generation
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const credentials: LoginCredentials = {
      email: req.body.email,
      password: req.body.password,
    };

    // Input validation is handled by middleware
    const user = await validateUser(credentials);

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // TODO: Generate JWT token
    // TODO: Return token to client
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    // TODO: Add proper error handling
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

