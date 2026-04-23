// backend/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

const users = [
  {
    name: 'Prof. Anita Sharma',
    email: 'teacher@college.edu',
    password: 'teacher123',
    role: 'teacher',
  },
  {
    name: 'Rahul Verma',
    email: 'rahul@college.edu',
    password: 'student123',
    role: 'student',
    enrollmentNumber: '21CS001',
    semester: '5th',
    class: 'CS-A',
  },
  {
    name: 'Priya Singh',
    email: 'priya@college.edu',
    password: 'student123',
    role: 'student',
    enrollmentNumber: '21CS002',
    semester: '5th',
    class: 'CS-A',
  },
  {
    name: 'Amit Kumar',
    email: 'amit@college.edu',
    password: 'student123',
    role: 'student',
    enrollmentNumber: '21CS003',
    semester: '5th',
    class: 'CS-B',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    console.log('Cleared existing users');

    for (const u of users) {
      const user = new User(u);
      await user.save();
    }

    console.log('');
    console.log('✅ Seeded users successfully!');
    console.log('');
    console.log('--- Login Credentials ---');
    console.log('Teacher:  teacher@college.edu / teacher123');
    console.log('Student1: rahul@college.edu   / student123');
    console.log('Student2: priya@college.edu   / student123');
    console.log('Student3: amit@college.edu    / student123');
    console.log('-------------------------');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();