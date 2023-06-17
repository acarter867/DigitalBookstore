const sequelize = require("../config/connection");
const {Model, DataTypes} = require("sequelize")

class APlus_Images extends Model{}

APlus_Images.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
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
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: "a_plus_images",
    }
);

module.exports = APlus_Images;