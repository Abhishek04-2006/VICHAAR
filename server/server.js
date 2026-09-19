const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const routes = require('./routes');

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('VICHAAR API is running successfully.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
});