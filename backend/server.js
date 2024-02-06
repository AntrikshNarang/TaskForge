const express = require('express');
const {connectToDB} = require('./db');
require('dotenv').config();
const cors = require('cors');

// cors config
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200
}
//  cors
const app = express();
const port = process.env.PORT;

app.use(cors(corsOptions));
app.use(express.json());


// Define routes
app.use('/api/auth',require('./routes/auth.js'))
app.use('/api/user', require('./routes/user.js'))
app.use('/api/admin', require('./routes/admin.js'))


// Start the Server and connect to Database
connectToDB();
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});