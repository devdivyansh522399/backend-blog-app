const express = require('express');
const dotenv = require('dotenv');
const morgan = require("morgan");
const connetDB = require('./config/db');
const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')
const cors = require("cors");
const bodyParser = require('body-parser');
dotenv.config()
connetDB()

const app = express();


app.use(morgan("dev"));
app.use(cors({
  origin : "https://blog522.vercel.app"
}));

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api/user', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comment', commentRoutes);
app.get('/', (req, res) => res.send('Server is running'))
app.listen(port, () => console.log(`Example app listening on port ${port }!`))
