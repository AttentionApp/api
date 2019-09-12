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
const authRouter = require('./server/routes/v1/auth-router');
const userRouter = require('./server/routes/v1/user-router');
const customerRouter = require('./server/routes/v1/customer-router');
const nurseRouter = require('./server/routes/v1/nurse-router');
const nurseTypeRouter = require('./server/routes/v1/nursetype-router');
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/customers', customerRouter);
app.use('/api/v1/nurses',nurseRouter);
app.use('/api/v1/nursetypes',nurseTypeRouter);

//Docs

const initSwagger = require('./server/docs/swagger');
initSwagger(app);

//Home
app.get('/',(req,res) => {
    res.status(200).send("Attention APP");
});

//Create server and listen
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});