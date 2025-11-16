// TypeScript interfaces for User operations (used by services/controllers)

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Hashed password (bcrypt) - stored in DB
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string; // Plain text password - will be hashed before saving
}

export interface LoginCredentials {
  email: string;
  password: string;
}

