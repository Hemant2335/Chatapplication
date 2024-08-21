import express from 'express';
const app = express();
import cookieParser = require('cookie-parser');
import cors from "cors"

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: ["https://onechatfrontend.vercel.app", "http://localhost:5173" ,"http://13.60.184.6:3000"]
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});