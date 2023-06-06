const Book = require("./Book");
const Brand = require("./Brand");
const Cart = require("./Cart");
const Category = require("./Category");
const Conversation = require("./Conversation");
const Download = require("./Download");
const Message = require("./Message");
const Purchase = require("./Purchase");
const Review = require("./Review");
const User = require("./User");
const Prod_Images = require('./Prod_Images');


// Set relationships of tables

User.hasMany(Review, {
    foreignKey: "poster_id"
});

User.hasMany(Purchase, {
    foreignKey: "buyer_id"
});

User.hasMany(Message, {
    foreignKey: "sender_id"
});

User.hasMany(Message, {
    foreignKey: "recipient_id"
});

User.hasMany(Download, {
    foreignKey: "downloader_id"
});

User.hasMany(Conversation, {
    foreignKey: "sender_id"
});

User.hasMany(Conversation, {
    foreignKey: "recipient_id"
});

Book.belongsTo(Brand, {
    foreignKey: {
        name: "brand_id",
        allowNull: true
    }
});

Book.belongsTo(Category, {
    foreignKey: {
        name: "category_id",
        allowNull: true
    }
});

Message.belongsTo(Conversation, {
    foreignKey: "conversation_id"
});

Conversation.hasMany(Message, {
    foreignKey: "conversation_id"
});

Cart.belongsTo(User, {
    foreignKey: "buyer_id"
});

module.exports = { Book, Brand, Cart, Category, Conversation, Download, 
    Message, Purchase, Review, User, Prod_Images} 