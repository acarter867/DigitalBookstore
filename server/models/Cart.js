const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Cart extends Model{}

Cart.init(
    {
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "book",
                key: 'id'
            }
        },
        buyer_id:{
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
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: "cart",
    }
);

module.exports = Cart;