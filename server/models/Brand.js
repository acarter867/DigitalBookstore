const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Brand extends Model{}

Brand.init(
    {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,            
            autoIncrement: true,
            primaryKey: true
        },
        brand_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: "brand",
    }
);

module.exports = Brand;