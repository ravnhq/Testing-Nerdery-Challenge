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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.getStarWarsPlanets = exports.createRandomProduct = exports.removeDuplicatesFromArray = exports.toLowerCase = exports.isInteger = void 0;
var faker_1 = __importDefault(require("faker"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var users_1 = __importDefault(require("./utils/users"));
var product_schema_1 = require("./utils/product.schema");
function isInteger(value) {
    return /^[0-9]{1,}$/.test(value);
}
exports.isInteger = isInteger;
function toLowerCase(str) {
    return str
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^-\w]/g, "")
        .replace(/-{2,}/g, "-");
}
exports.toLowerCase = toLowerCase;
function removeDuplicatesFromArray(arrayOfNumbers) {
    if (!Array.isArray(arrayOfNumbers)) {
        throw new Error("please provide an array of numbers or strings");
    }
    if (arrayOfNumbers.length === 1) {
        return arrayOfNumbers;
    }
    return arrayOfNumbers.filter(function (e, pos) {
        return arrayOfNumbers.indexOf(e) === pos;
    });
}
exports.removeDuplicatesFromArray = removeDuplicatesFromArray;
var createProduct = function (product) {
    var isValid = product_schema_1.createProductSchema.validate(product);
    if (isValid.error) {
        throw new Error(JSON.stringify(isValid.error.details));
    }
    return __assign({ id: faker_1.default.datatype.number() }, product);
};
exports.createProduct = createProduct;
var createFakeProduct = function () {
    return {
        id: faker_1.default.datatype.number(),
        name: faker_1.default.commerce.productName(),
        description: faker_1.default.commerce.productDescription(),
        price: faker_1.default.commerce.price(),
        tags: [faker_1.default.commerce.productMaterial(), faker_1.default.commerce.color()],
    };
};
var createRandomProduct = function (email) {
    var userRole = users_1.default.find(function (user) { return user.email === email; }).role;
    var creatorRoles = ["creator"];
    if (!creatorRoles.includes(userRole)) {
        throw new Error("You are not allowed to create products");
    }
    return createFakeProduct();
};
exports.createRandomProduct = createRandomProduct;
var getStarWarsPlanets = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, body, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, node_fetch_1.default("https://swapi.dev/api/planets")];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                body = _a.sent();
                return [2 /*return*/, body];
            case 3:
                e_1 = _a.sent();
                throw new Error("unable to make request");
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getStarWarsPlanets = getStarWarsPlanets;
console.log('removeDuplicatesFromArray', removeDuplicatesFromArray([1, 2, 1, 1, 3]));
//# sourceMappingURL=index.js.map