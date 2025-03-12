const express = require('express');
const app = express();
const  cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Testing route
app.get('/', (req, res) => {
    res.send('Hello and welcome to Sesa Application');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server Sesa is running on port ${port}`);
})