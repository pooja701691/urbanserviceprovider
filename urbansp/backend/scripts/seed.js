const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const User = require('../src/models/user.model');
const Service = require('../src/models/service.model');
const connectDB = require('../src/config/db');

const seed = async () => {
  try {
    await connectDB();

    // Clear
    await User.deleteMany({});
    await Service.deleteMany({});

    const admin = new User({ name: 'Admin', email: 'admin@usp.com', password: 'password123', phone: '0000000000', role: 'admin', isVerified: true, city: 'Delhi', state: 'Delhi', pincode: '110001' });
    await admin.save();

    const user = new User({ name: 'Test User', email: 'user@usp.com', password: 'password123', phone: '1111111111', isVerified: true, city: 'Delhi', state: 'Delhi', pincode: '110001' });
    await user.save();

    const services = [
      {
        title: 'AC Repair',
        description: 'Fix AC issues',
        category: 'AC',
        price: 1200,
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        landmark: 'Near Connaught Place',
        location: { type: 'Point', coordinates: [77.2090, 28.6139] },
        createdBy: admin._id,
      },
      {
        title: 'Home Cleaning',
        description: 'Deep cleaning service',
        category: 'Cleaning',
        price: 800,
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        landmark: 'Near Sector 18',
        location: { type: 'Point', coordinates: [77.4493, 28.5355] },
        createdBy: admin._id,
      },
      {
        title: 'Plumbing',
        description: 'Fix leaks and pipes',
        category: 'Plumber',
        price: 500,
        city: 'Gurgaon',
        state: 'Haryana',
        pincode: '122001',
        landmark: 'Near DLF Cyber City',
        location: { type: 'Point', coordinates: [77.0266, 28.4595] },
        createdBy: admin._id,
      },
    ];

    await Service.insertMany(services);

    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
