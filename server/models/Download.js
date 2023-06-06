const { Model, DataTypes } = require("sequelize");
const sequelize = require('../config/connection');

class Download extends Model{}

Download.init(
    {
        book_name: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
        book_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        donloads: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        downloader_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: "download",
    }
);

module.exports = Download;