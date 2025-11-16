// User model interfaces

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Raw password - no hashing yet
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string; // Raw password - no hashing yet
}

export interface LoginCredentials {
  email: string;
  password: string;
}

