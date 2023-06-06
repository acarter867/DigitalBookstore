const sequelize = require('../config/connection')
const { Book, User } = require('../models');

const bookData = require('./book.json');
const userData = require('./user.json');

const seedData = async() => {
  await sequelize.sync({force: true});

  await Book.bulkCreate(bookData, {
    individualHooks: true,
    returning: true
  });
  console.log("------------BOOK SEEDS COMPLETE-----------")
  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true
  });
  console.log("------------USER SEEDS COMPLETE-----------")

  console.log('Data seeding complete.');
  process.exit(0);
};

seedData();