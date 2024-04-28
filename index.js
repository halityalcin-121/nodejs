const path = require('path');
const express = require("express");
const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
const cors = require("cors");
const connection = require("./database/db");
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
//const errorHandler = require('./middleware/error');

dotenv.config({ path: './config.env' });

app.use(express.json({ limit: '50mb' }));
app.use(cors());
//app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use(cookieParser());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

const authRouter = require("./routers/auth.router");
const categoryRouter = require("./routers/category.router");
const testRouter = require("./routers/test.router");
const basketRouter = require("./routers/basket.router");
const followerRouter = require("./routers/follower.router");
const messageRouter = require("./routers/message.router");
const viewRouter = require("./routers/viewRoutes");




if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(compression());

// app.use((req, res, next) => {
//   console.log('middleware den selamlar');
// });

app.use("/", viewRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/tests", testRouter);
app.use("/api/baskets", basketRouter);
app.use("/api/followers", followerRouter);
app.use("/api/messages", messageRouter);



connection();
//app.use(errorHandler); bunu çalıştıramadık

const port = process.env.PORT || 5001;
app.listen(port, () =>
  console.log("uygulama ayakta")
);

// Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
//   // console.log(`Error: ${err.message}`.red);
//   // Close server & exit process
//   // server.close(() => process.exit(1));
// });