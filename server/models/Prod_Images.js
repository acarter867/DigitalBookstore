const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Prod_Images extends Model{}

Prod_Images.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        product_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        alt_text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: "prod_images"
    }
);

module.exports = Prod_Images;