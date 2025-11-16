import bcrypt from 'bcrypt';
import { User as UserModel, IUser } from '../models/User';
import { User, CreateUserData, LoginCredentials } from '../models/UserTypes';

// Helper function to convert MongoDB document to User type
const toUser = (doc: IUser): User => ({
  id: (doc as any)._id.toString(), // Mongoose _id converted to string
  name: doc.name,
  email: doc.email,
  password: doc.password, // Hashed password stored in DB
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

// TODO: Add email validation
// TODO: Add duplicate email error handling
export const createUser = async (userData: CreateUserData): Promise<User> => {
  try {
    // Hash password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create new user in database with hashed password
    const newUser = new UserModel({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log('User saved successfully:', { id: savedUser._id, email: savedUser.email });
    return toUser(savedUser);
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw error; // Re-throw to be handled by controller
  }
};

// TODO: Add proper error handling for database queries
export const validateUser = async (credentials: LoginCredentials): Promise<User | null> => {
  // Find user by email
  const user = await UserModel.findOne({ email: credentials.email });

  if (!user) {
    return null;
  }

  // Compare hashed password with provided password
  const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return toUser(user);
};

