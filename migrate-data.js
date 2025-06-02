"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var mongodb_1 = require("@/lib/mongodb");
var User_1 = require("@/models/User");
var Order_1 = require("@/models/Order");
var mongoose_1 = require("mongoose");
var usersFilePath = path_1.default.join(__dirname, 'data', 'users.json');
var ordersFilePath = path_1.default.join(__dirname, 'data', 'orders.json');
function migrateData() {
    return __awaiter(this, void 0, void 0, function () {
        var usersData, usersToInsert, userInsertResult, ordersData, ordersToInsert, orderInsertResult, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, 5, 8]);
                    console.log('Connecting to MongoDB...');
                    return [4 /*yield*/, (0, mongodb_1.default)()];
                case 1:
                    _a.sent();
                    console.log('MongoDB connected.');
                    // --- Migrate Users ---
                    console.log('Reading users from users.json...');
                    usersData = JSON.parse(fs_1.default.readFileSync(usersFilePath, 'utf8')).users;
                    console.log("Found ".concat(usersData.length, " users in users.json."));
                    usersToInsert = usersData.map(function (user) {
                        // Map JSON structure to Mongoose schema structure
                        // Mongoose will generate _id automatically
                        var id = user.id, rest = __rest(user, ["id"]); // Exclude old JSON ID
                        return __assign({}, rest);
                    });
                    console.log('Inserting users into MongoDB...');
                    return [4 /*yield*/, User_1.default.insertMany(usersToInsert, { ordered: false })];
                case 2:
                    userInsertResult = _a.sent();
                    console.log("Successfully inserted ".concat(userInsertResult.length, " users into MongoDB."));
                    // --- Migrate Orders ---
                    console.log('Reading orders from orders.json...');
                    ordersData = JSON.parse(fs_1.default.readFileSync(ordersFilePath, 'utf8')).orders;
                    console.log("Found ".concat(ordersData.length, " orders in orders.json."));
                    ordersToInsert = ordersData.map(function (order) {
                        // Map JSON structure to Mongoose schema structure
                        var id = order.id, rest = __rest(order, ["id"]); // Exclude old JSON ID
                        var items = order.items.map(function (item) {
                            var id = item.id, itemRest = __rest(item, ["id"]); // Exclude old JSON item ID if present
                            return __assign(__assign({}, itemRest), { id: item.id // Keep the product ID as defined in your OrderItem schema
                             });
                        });
                        return __assign(__assign({}, rest), { items: items });
                    });
                    console.log('Inserting orders into MongoDB...');
                    return [4 /*yield*/, Order_1.default.insertMany(ordersToInsert, { ordered: false })];
                case 3:
                    orderInsertResult = _a.sent();
                    console.log("Successfully inserted ".concat(orderInsertResult.length, " orders into MongoDB."));
                    console.log('Data migration complete.');
                    return [3 /*break*/, 8];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error during data migration:', error_1);
                    if (error_1.writeErrors) {
                        console.error('Write Errors (possibly duplicates):', error_1.writeErrors);
                    }
                    return [3 /*break*/, 8];
                case 5:
                    if (!(mongoose_1.default.connection.readyState === 1)) return [3 /*break*/, 7];
                    return [4 /*yield*/, mongoose_1.default.disconnect()];
                case 6:
                    _a.sent();
                    console.log('MongoDB disconnected.');
                    _a.label = 7;
                case 7:
                    process.exit(0); // Exit the script
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Run the migration function
migrateData();
