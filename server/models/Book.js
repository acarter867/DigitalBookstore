const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Book extends Model{}

Book.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        display_title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        subtitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "category",
                key: "id",
                allowNull: true
            }
        },
        brand_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "brand",
                key: "id",
                allowNull: true
            }
        },
        type: {
            type: DataTypes.STRING,
        },
        extension: {
            type: DataTypes.STRING,
        },
        front_thumbnail:{
            type: DataTypes.STRING,
            allowNull: true
        },
        back_thumbnail: {
            type: DataTypes.STRING,
            allowNull: true
        },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: "book",
    }
);

module.exports = Book;