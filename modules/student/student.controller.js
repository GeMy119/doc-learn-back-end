import studentModel from "../../db/model/student.model.js";
import bcrypt from "bcrypt";
import { signInSchem, signUpValidationSchema } from "./student.validation.js";
import jwt from "jsonwebtoken";

//? Retrieve all Students
const getAllStudent = async (req, res) => {
  try {
    let viewStudent = await studentModel.find();
    res.json({ message: "Here's a list of all Students", viewStudent });
  } catch (error) {
    res.json({
      message: "An Error occured while retrieving All Students Data",
      error,
    });
  }
};

//? Student Signup
const signUp = async (req, res) => {
  try {
    console.log("INSIDE SIGN UP");
    let { error } = signUpValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      res.status(400).json({ message: "Student Validation error", error });
    } else {
      let { id } = req.body;
      let foundStudent = await studentModel.findOne({ id: id });
      foundStudent &&
        res.status(409).json({ message: "Student id already exists" });
      console.log(foundStudent);
      if (!foundStudent) {
        let hashedPassword = bcrypt.hashSync(req.body.password, 10);
        let addedStudent = await studentModel.create({
          ...req.body,
          password: hashedPassword,
        });

        const token = jwt.sign({ id: addedStudent._id }, "secret_key", {
          expiresIn: "30d",
        });
        const StudentType = "Student";
        res.status(201).json({
          message: "Student SignUp successful",
          addedStudent,
          token,
        });

      }
    }
  } catch (error) {
    console.log("Signup Error: ", error);
  }
};


//? Student Signin

const signIn = async (req, res) => {
  try {
    console.log(req.body.id);
    let { error } = signInSchem.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({ message: "User SignIn Schema Validation Error: ", error });
    } else {
      let foundUser = await studentModel.findOne({ id: req.body.id });
      if (!foundUser) {
        res
          .status(404)
          .json({ message: "User not found, You need to create an account" });
      }
      let matched = bcrypt.compareSync(req.body.password, foundUser.password);
      console.log("Passwords match?", matched);

      if (matched) {
        let token = jwt.sign({ id: foundUser.id, role: foundUser.role }, "SecretKeyCanBeAnything", {
          expiresIn: "30d", // when expired you cannot access /profile
        });
        console.log(token);
        //! Sitting the token in the response cookiesafter successful login
        res.cookie(
          "token",
          token,
          { httpOnly: true }
        );
        res
          .status(200)
          .json({ message: "User logged in successfully", token, role: foundUser.role });
      } else {
        res.status(404).json({ message: "Please check your User password" });
      }
    }
  }
  catch (error) {
    console.log("User Signin Error: ", error);
  }
};

//? Logout
//? Logout
const logout = (req, res) => {
  try {
    // Clear the token from the client-side storage (e.g., localStorage)
    res.clearCookie('token'); // Assuming you are using cookies to store the token
    res.status(200).json({ message: "You are now Logged out" });
  } catch (error) {
    res.status(400).json({ message: "Logout Error: ", error });
  }
};
const editIsPay = async (req, res) => {
  try {
    const editStudentPay = await studentModel.findByIdAndUpdate({ id: req.student.id }, { isPay: false }, { new: true })
    res.status(200).json({ message: "student payment role updated" })
  } catch (error) {
    res.status(500).json({ message: "internal server error" })

  }
}

export {
  getAllStudent,
  signIn,
  signUp,
  logout,
  editIsPay
};
