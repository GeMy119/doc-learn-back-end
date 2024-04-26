import express from "express";
import { initConnection } from "./db/connection.js";
import studentRoutes from "./modules/student/student.routes.js";
import "dotenv/config.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import questionRoutes from "./modules/questions/question.routes.js";
import { payment_route } from "./modules/payment/payment.router.js";
import paymentFormRoutes from "./modules/paymentForm/paymentForm.routes.js"
const app = express();

const port = process.env.PORT || 4000;

app.use(cors());
initConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.set('view engine', 'ejs');
app.use(cookieParser());

app.use(studentRoutes);
app.use(questionRoutes)
app.use(payment_route)
app.use(paymentFormRoutes)


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
