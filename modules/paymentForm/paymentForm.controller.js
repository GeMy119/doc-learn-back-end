// Import your payment model
import Payment from "../../db/model/paymentForm.model.js";

const savePaymentData = async (req, res) => {
  try {
    // Extract payment data from request body
    const { firstName, lastName, email, phone, isChecked } = req.body;

    // Check if any required field is missing
    if (!firstName || !lastName) {
      return res.status(400).json({ message: "Please provide both first name and last name" });
    }
    else{
      console.log(req.body)
    }
    // Create a new document using the Payment model
    const newPayment = new Payment({
      firstName,
      lastName,
      email,
      phone,
      isChecked
    });

    // Save the data to the database
    await newPayment.save();

    res.status(201).json({ message: "Payment data saved successfully" });
  } catch (error) {
    console.error("Error saving payment data:", error);
    res.status(500).json({ message: "Error saving payment data" });
  }
};

export { savePaymentData };
