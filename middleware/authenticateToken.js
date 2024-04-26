import jwt from "jsonwebtoken";

const authenticateTokenCookie = (req, res, next) => {
  console.log("Inside authentication middleware");

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

export { authenticateTokenCookie };
