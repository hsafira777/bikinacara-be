"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_KEY = exports.PORT = void 0;
require("dotenv/config");
_a = process.env, exports.PORT = _a.PORT, exports.SECRET_KEY = _a.SECRET_KEY;
