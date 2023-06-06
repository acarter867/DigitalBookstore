const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Review extends Model{}

Review.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [5, 20]
            }
        },
        body: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [0, 200]
            }
        },
        poster_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id"
            }
        }

    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: "review",
    }
);

module.exports = Review;