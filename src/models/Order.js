"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
// Define the schema for OrderItem (as a sub-schema)
var OrderItemSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
}, { _id: false }); // _id: false prevents Mongoose from creating a sub-document _id
// Define the order schema
var OrderSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, required: true, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    paymentId: { type: String },
});
// Check if the model already exists before compiling
var Order = mongoose_1.default.models.Order || mongoose_1.default.model('Order', OrderSchema);
exports.default = Order;
