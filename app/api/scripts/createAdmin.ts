import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import Admin from '../models/Admin.js';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const createAdmin = async () => {
  try {
    await connectDB();

    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');
    const name = await question('Enter admin name: ');

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('❌ Admin with this email already exists');
      process.exit(1);
    }

    const admin = await Admin.create({ email, password, name });
    console.log(`✅ Admin created successfully: ${admin.email}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
};

createAdmin();

