const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path to your User model
const dbConfig = require('./config/db'); // Adjust the path to your dbConfig file

const email = 'fury@mail'; // Replace with the email you want to add
const password = 'fury'; // Replace with the password you want to add

mongoose.connect(dbConfig.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const addUser = async () => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`User already exists: ${email}`);
      return;
    }

    const user = new User({ email, password });
    await user.save();

    console.log(`User added: ${email}`);
    mongoose.connection.close();
  } catch (err) {
    console.error('Error adding user:', err);
    mongoose.connection.close();
  }
};

addUser();
