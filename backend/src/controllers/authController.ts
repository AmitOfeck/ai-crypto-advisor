import { Request, Response } from 'express';
import { CreateUserData, LoginCredentials } from '../models/UserTypes';
import { createUser, validateUser } from '../services/authService';
import { generateToken } from '../services/jwtService';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData: CreateUserData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    // Input validation is handled by middleware
    const newUser = await createUser(userData);

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
    });

    res.status(201).json({
      message: 'User created successfully',
      token,
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
    // Log full error for debugging
    console.error('Signup error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

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

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.status(200).json({
      message: 'Login successful',
      token,
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

