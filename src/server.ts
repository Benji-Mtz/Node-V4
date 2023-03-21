import express from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';
import { protect } from './modules/auth';

const app = express();

// Custom middleware
const customLogger = ( message ) => (req, res, next) => {
    console.log(`Hello from ${message}`);
    next();
}


app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(customLogger('Customer Logger Test'));


// app.use((req, res, next) => {
//     req.shhh_secret = 'doggy';
//     next();
// })

/**
 * app.[method]([route], [route handler])
*/
app.get('/', (req, res) => {
    console.log('Hello express!');

    res.status(200);
    res.json({msg: 'hello'});
});

app.use('/api',protect, router);

// module.exports = app;
export default app;