const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Conversation extends Model{}

Conversation.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        sender_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: "user",
                key: "id"
            }
        },
        recipient_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id"
            }
        },
    },
    {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: "conversation",
    }
);

module.exports = Conversation;