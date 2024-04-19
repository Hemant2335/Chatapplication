"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cookieParser = require("cookie-parser");
const cors_1 = __importDefault(require("cors"));
app.use(express_1.default.json());
app.use(cookieParser());
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:5173"
}));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
