const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path to your User model
const dbConfig = require('./config/db'); // Adjust the path to your dbConfig file

const email = 'testuser@example.com'; // Replace with the email you want to test
const password = 'password123'; // Replace with the password you want to test

const testPassword = async () => {
  try {
    await mongoose.connect(dbConfig.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await User.findOne({ email });
    if (user) {
      console.log(`User found: ${email}`);
      const isPasswordValid = await user.isValidPassword(password);
      console.log(`Password validation result: ${isPasswordValid}`);
    } else {
      console.log(`User not found: ${email}`);
    }

    mongoose.connection.close();
  } catch (err) {
    console.error('Error during password validation:', err);
  }
};

testPassword();
