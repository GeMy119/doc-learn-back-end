import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, 'Full name must contain at least 3 characters'],
      maxLength: [20, 'Full name must contain at most 20 characters'],
    },
    lastName: {
      type: String,
      required: true,
      minLength: [3, 'Full name must contain at least 3 characters'],
      maxLength: [20, 'Full name must contain at most 20 characters'],
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    isChecked: { type: Boolean, default: false, required: true }
  },
  {
    timestamps: true,
  }
);

const paymentModel = mongoose.model("Payment", PaymentSchema);

export default paymentModel;
