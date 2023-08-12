const express = require('express');
const dotenv = require('dotenv');
const morgan = require("morgan");
const path = require('path')
const connetDB = require('./config/db');
const authRoutes = require('./routes/authRoutes')

dotenv.config()
connetDB()

const app = express();
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

const port = process.env.PORT || 5000;
app.use(express.json());
app.use('/api/user', authRoutes);

app.get('/', (req, res) => res.send('Server is running'))
app.listen(port, () => console.log(`Example app listening on port ${port }!`))