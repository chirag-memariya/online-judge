const express = require('express');
const cors = require('cors');
const app = express();
const { DBConnection } = require('./database/db.js');
const dotenv = require('dotenv');
dotenv.config();

DBConnection();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // To allow cookies to be sent and received
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/userRoutes');
const problemRoutes = require('./routes/problemRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const testcaseRoutes = require('./routes/testcaseRoutes');

app.use('/users', userRoutes);
app.use('/problems', problemRoutes);
app.use('/submissions', submissionRoutes);
app.use('/testcases', testcaseRoutes);


app.get("/", (req, res) => {
    res.send("Welcome to Online Judge!");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("server is listening on port 8000");
});