const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Purchase extends Model{}

Purchase.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        book_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "book",
                key: "id",
            }
        },
        buyer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            }
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,            
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: "purchase", 
    }
);

module.exports = Purchase;