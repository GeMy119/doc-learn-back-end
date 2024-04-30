import express from "express";
import {
  getAllStudent,
  signIn,
  signUp,
  logout,
  editIsPay
} from "./student.controller.js";
import { signInSchem, signUpValidationSchema } from "./student.validation.js";
import { validation } from "../../middleware/validation.js";
import { authenticateTokenCookie } from "../../middleware/authenticateToken.js";
const studentRoutes = express.Router();

//?Get All students
studentRoutes.get("/students", getAllStudent);

//? student Signup
studentRoutes.post("/signup", validation(signUpValidationSchema), signUp);

//? Login student
studentRoutes.post(
  "/login",
  validation(signInSchem),
  signIn
  // authenticateTokenCookie,
);

//? Logout
studentRoutes.post("/logout", logout);
studentRoutes.put("/editPay", authenticateTokenCookie, editIsPay);

export default studentRoutes;
