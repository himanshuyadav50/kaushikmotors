import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import Vehicle from '../models/Vehicle.js';
import Testimonial from '../models/Testimonial.js';
import Settings from '../models/Settings.js';
import Admin from '../models/Admin.js';
import { sampleVehicles, sampleTestimonials, defaultSettings } from '../../data/sampleData.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Vehicle.deleteMany({});
    await Testimonial.deleteMany({});
    await Settings.deleteMany({});

    // Seed vehicles
    const vehicles = await Vehicle.insertMany(
      sampleVehicles.map((v) => ({
        ...v,
        createdAt: new Date(v.createdAt),
        updatedAt: new Date(v.updatedAt),
      }))
    );
    console.log(`✅ Seeded ${vehicles.length} vehicles`);

    // Seed testimonials
    const testimonials = await Testimonial.insertMany(sampleTestimonials);
    console.log(`✅ Seeded ${testimonials.length} testimonials`);

    // Seed settings
    const settings = await Settings.create(defaultSettings);
    console.log(`✅ Seeded settings`);

    // Create admin if doesn't exist
    const adminExists = await Admin.findOne({ email: 'admin@autoelite.com' });
    if (!adminExists) {
      await Admin.create({
        email: 'admin@autoelite.com',
        password: 'admin123',
        name: 'Admin User',
      });
      console.log(`✅ Created admin user (admin@autoelite.com / admin123)`);
    } else {
      console.log(`ℹ️ Admin user already exists`);
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

