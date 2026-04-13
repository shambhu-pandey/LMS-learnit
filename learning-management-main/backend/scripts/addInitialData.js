const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const addInitialData = async () => {
  try {
    const instructor = await User.findOne({ role: 'teacher' });

    if (!instructor) {
      console.log('No instructor found. Please create an instructor first.');
      process.exit(1);
    }

    const courses = [
      {
        title: 'Web Development',
        description: 'Learn the basics of web development.',
        category: 'Development',
        instructor: instructor._id,
        content: [
          { type: 'video', url: 'https://example.com/web-development-video' },
        ],
      },
      {
        title: 'Java Basics',
        description: 'Learn the basics of Java programming.',
        category: 'Programming',
        instructor: instructor._id,
        content: [
          { type: 'video', url: 'https://example.com/java-basics-video' },
        ],
      },
    ];

    await Course.insertMany(courses);
    console.log('Initial data added successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error adding initial data:', error);
    process.exit(1);
  }
};

addInitialData();