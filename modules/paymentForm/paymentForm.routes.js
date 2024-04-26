import express from "express";
import {
  savePaymentData
} from "./paymentForm.controller.js";
const paymentFormRoutes = express.Router();

paymentFormRoutes.post('/savePaymentData', savePaymentData);

export default paymentFormRoutes;
