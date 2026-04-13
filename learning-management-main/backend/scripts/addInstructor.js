const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const addInstructor = async () => {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const instructor = new User({
      name: 'Instructor',
      email: 'instructor@example.com',
      password: hashedPassword,
      role: 'teacher',
    });

    await instructor.save();
    console.log('Instructor added successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error adding instructor:', error);
    process.exit(1);
  }
};

addInstructor();