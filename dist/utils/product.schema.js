"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductSchema = void 0;
var joi_1 = __importDefault(require("joi"));
var createProductSchema = joi_1.default.object({
    name: joi_1.default.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    description: joi_1.default.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    tags: joi_1.default.array().items(joi_1.default.string()).length(1).required(),
    price: joi_1.default.number().min(0).precision(2).required(),
});
exports.createProductSchema = createProductSchema;
//# sourceMappingURL=product.schema.js.map