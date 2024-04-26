import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    id: {
      unique: true,
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    year: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPay: {
      type: Boolean,
      default: false
    },
    university: {
      type: String,
      required: true,
    },
    faculty: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    agreeToTerms: { type: Boolean, default: false, required: true }
  },
  
  {
    timestamps: true,
  }
);

const studentModel = mongoose.model("Student", studentSchema);

export default studentModel;
