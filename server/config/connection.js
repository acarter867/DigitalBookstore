const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.HOSTNAME,
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
    }
  );

try {
    console.log(process.env.DB_NAME,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD,)
    sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

module.exports = sequelize;