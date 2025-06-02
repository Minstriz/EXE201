"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
// Define the user schema
var UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Password can be optional if using OAuth/social login
    fullName: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    province: { type: String },
    createdAt: { type: Date, default: Date.now },
});
// Check if the model already exists before compiling
var User = mongoose_1.default.models.User || mongoose_1.default.model('User', UserSchema);
exports.default = User;
