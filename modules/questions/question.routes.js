// Import necessary modules and functions
import express from "express";
import { getAllQuestions } from "./question.controller.js";

// Create a router instance
const questionRoutes = express.Router();

// Define route handlers
questionRoutes.get("/questions", getAllQuestions);

// Export the router instance
export default questionRoutes;
