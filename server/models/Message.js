const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Message extends Model{}

Message.init(
    {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        body:{
            allowNull: false,
            type: DataTypes.STRING,
        },
        sender_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id"
            }
        },
        recipient_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id"
            }
        },
        conversation_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "conversation",
                key: "id"
            }
        },
    },
    {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: "message",
    }
);

module.exports = Message;
