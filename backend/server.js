
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRoute.js";
import dotenv from "dotenv";
import cors from 'cors';
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import bodyParser from 'body-parser'
import path from 'path'

dotenv.config();

const app = express();
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Connect with Database
mongoose
  .connect(process.env.MONGODB_URL || "mongodb://localhost/xstore", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((con) => {
    console.log(
      `MongoDB Database connected successfully with ${con.connection.host}`
    );
  });


//users
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
app.use("/api/payment", paymentRouter);

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, '/frontend/build')));
// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
// );
app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
   
    // Domain nhất định
     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
   
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running ... in http://localhost:${process.env.PORT}`);
});
