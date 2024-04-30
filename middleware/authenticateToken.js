import jwt from "jsonwebtoken";
import studentModel from "../db/model/student.model.js";

const authenticateTokenCookie = (req, res, next) => {
  const token = req.headers.authorization;
  console.log("Token from headers in authenticateTokenCookie function: ", token);

  if (!token) {
    return res.status(401).json({ message: "Please provide a cookie token" });
  }

  let tokenValue = token;
  if (token.startsWith("Bearer ")) {
    tokenValue = token.slice(7); // Remove 'Bearer ' prefix
  }

  jwt.verify(tokenValue, "SecretKeyCanBeAnything", (err, decoded) => {
    if (err) {
      console.log("Error inside handleVerificationResult: ", err);
      return res.status(403).json({ message: "Cookie token verification failed", error: err });
    }

    req.student = decoded; // Decoded payload is set as the student property of the req object
    console.log("Decoded payload inside authentication middleware: ", decoded);
    next(); // Move to the next middleware or route handler
  });
};

const checkPay = async (req, res, next) => {
  try {
    const student = req.student;
    const foundStudent = await studentModel.findOne({ id: student.id });
    if (!foundStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (!foundStudent.isPay) {
      return res.status(401).json({ message: "Pay first to show questions" });
    }
    console.log("pass pay")
    next();
  } catch (error) {
    console.error("Error in checkPay middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { authenticateTokenCookie, checkPay };
