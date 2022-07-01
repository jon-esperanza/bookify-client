import express from 'express';

// create app
const app = express();

// configure app
let port = 3000;
let host = 'localhost';

// middlewares
app.use(express.urlencoded({extended: true}));

// routes
app.get('/', (req, res, next) => {
    res.send('hi this is still working just making a change.');
});

// start server
app.listen(port, host, ()=>{
    console.log('Server is running on port', port);
});