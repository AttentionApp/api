//Dependencies
const http = require('http');
const express = require('express');

//Setup
const PORT = process.env.PORT || 3000;
const app = express();

//Middleware
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { allowCORS } = require('./server/middleware/cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('common'));

app.use(allowCORS);

//Routes
const authRouter = require('./server/routes/auth-router');
const userRouter = require('./server/routes/user-router');

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

app.get('/',(req,res) => {
    res.status(200).send("api works!");
});

//Create server and listen
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});