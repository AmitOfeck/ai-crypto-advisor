import { User as UserModel, IUser } from '../models/User';
import { User, CreateUserData, LoginCredentials } from '../models/UserTypes';

// Helper function to convert MongoDB document to User type
const toUser = (doc: IUser): User => ({
  id: (doc as any)._id.toString(), // Mongoose _id converted to string
  name: doc.name,
  email: doc.email,
  password: doc.password,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

// TODO: Add password hashing
// TODO: Add email validation
// TODO: Add duplicate email error handling
export const createUser = async (userData: CreateUserData): Promise<User> => {
  // Create new user in database
  const newUser = new UserModel({
    name: userData.name,
    email: userData.email,
    password: userData.password, // Raw password - no hashing yet
  });

  await newUser.save();
  return toUser(newUser);
};

// TODO: Add password verification (compare hashed passwords)
// TODO: Add proper error handling for database queries
export const validateUser = async (credentials: LoginCredentials): Promise<User | null> => {
  // Find user by email
  const user = await UserModel.findOne({ email: credentials.email });

  if (!user) {
    return null;
  }

  // TODO: Compare hashed password with credentials.password
  // For now, simple string comparison (not secure - will be fixed with password hashing)
  if (user.password !== credentials.password) {
    return null;
  }

  return toUser(user);
};

