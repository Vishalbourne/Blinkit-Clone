const express = require('express');
const app = express();

require('dotenv').config(); // Load environment variables


const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const userRouter = require('./routes/user');
const cartRouter = require('./routes/cart');
const paymentRouter = require('./routes/payment')


const path = require('path');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const connectDB=require('./config/db'); // Import DB connection
connectDB(); // Connect to MongoDB

require('./config/google-auth')

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());


app.use("/",indexRouter)
app.use('/auth',authRouter)
app.use("/admin", adminRouter)
app.use('/products', productRouter)
app.use('/categories', categoryRouter)
app.use('/users', userRouter)
app.use('/cart', cartRouter)
app.use('/payment',paymentRouter)

app.listen(process.env.PORT);
