// import Stripe from 'stripe';
// import studentModel from '../../db/model/student.model.js';

// const { STRIPE_SECRET_KEY } = process.env;
// const stripe = new Stripe(STRIPE_SECRET_KEY);

// const payment = async (req, res) => {
//     try {
//         console.log(req.body.stripeToken);
//         if (!req.body.stripeToken) {
//             throw new Error("Missing stripeToken");
//         }

//         const customer = await stripe.customers.create({
//             email: req.body.stripeEmail,
//             source: req.body.stripeToken,
//             name: 'Sandeep Sharma',
//             address: {
//                 line1: '115, Vikas Nagar',
//                 postal_code: '281001',
//                 city: 'Mathura',
//                 state: 'Uttar Pradesh',
//                 country: 'India',
//             }
//         });

//         const charge = await stripe.charges.create({
//             amount: req.body.amount * 100, // amount in cents
//             description: req.body.productName,
//             currency: 'INR',
//             customer: customer.id
//         });

//         let foundStudent = await studentModel.findOne({ email: req.body.stripeEmail });
//         if (foundStudent) {
//             foundStudent.isPay = true;
//             await foundStudent.save(); // Save the changes to the document
//         }
//         res.status(200).json("done");
//     } catch (error) {
//         console.error(error);
//         res.redirect("/failure");
//     }
// };

// const success = async (req, res) => {
//     try {
//         res.status(200).json("payment done");
//         console.log("done");
//     } catch (error) {
//         console.error(error);
//         res.status(500).json("Internal Server Error");
//     }
// };

// const failure = async (req, res) => {
//     try {
//         res.json('failure');
//     } catch (error) {
//         console.error(error);
//         res.status(500).json("Internal Server Error");
//     }
// };

// export {
//     payment,
//     success,
//     failure
// };
import axios from 'axios';
import studentModel from '../../db/model/student.model.js';
const PAYMOB_URL = "https://accept.paymob.com/api";
import transaction from "../../db/model/transaction.model.js"

const payment = async (req, res) => {
    try {
        const token = await getToken();
        const orderId = await createOrder(token);
        const paymentToken = await generatePaymentToken(token, orderId, req.student.id);
        const iframeURL = await getIframeURL(paymentToken);
        res.status(200).json({ iframeURL });
    } catch (error) {
        // console.error('Error initiating payment:', error);
        res.status(500).json({ error: 'Failed to initiate payment' });
    }
};

// Function to generate payment token
async function generatePaymentToken(token, orderId, student) {
    const studentLogedIn = await studentModel.findOne({ id: student })
    // console.log(studentLogedIn)
    const data = {
        "auth_token": token,
        "amount_cents": "1500",
        "expiration": 3600,
        "order_id": orderId,
        "billing_data": {
            "email": studentLogedIn.email,
            "phone_number": `+2${studentLogedIn.phone}`,
            "first_name": studentLogedIn.firstName,
            "last_name": studentLogedIn.lastName,
            "apartment": "NA",
            "floor": "NA",
            "street": "NA",
            "building": "NA",
            "postal_code": "NA",
            "city": "NA",
            "country": "NA",
            "state": "NA"
        },
        "currency": "EGP",
        "integration_id": 4485993
    };
    console.log(data)
    const response = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', data);
    console.log(response)
    return response.data.token;
}
// Function to get authentication token
async function getToken() {
    const data = { "api_key": process.env.API_KEY, "username": process.env.USERNAME, "password": process.env.PASSWORD };
    // console.log(data)
    const response = await fetch('https://accept.paymob.com/api/auth/tokens', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const responseData = await response.json();
    // console.log(responseData)
    return responseData.token;

}

// Function to create an order
async function createOrder(token) {
    const data = {
        "auth_token": token,
        "delivery_needed": "false",
        "amount_cents": "1500",
        "currency": "EGP",
        "items": []
    };
    const response = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const responseData = await response.json();
    return responseData.id;
}

// Function to get the URL for the payment iframe
async function getIframeURL(token) {
    // return `https://accept.paymob.com/api/acceptance/iframes/4485926?payment_token=${token}`;
    return `https://accept.paymob.com/api/acceptance/iframes/824809?payment_token=${token}`;
}
const callbackNode = async (req, res) => {
    try {
        const transactionData = req.query;
        if (Object.keys(transactionData).length > 0) {
            // Data received
            // Perform actions to save the data here
            await saveTransaction(transactionData)
            // console.log('Received transaction data:', transactionData);

            // Send a success response
            res.status(200).json({ message: 'Received transaction data and saved successfully.', data: transactionData }).redirrect("https://6628754647e1144a767e6478--astonishing-tapioca-480cff.netlify.app/#/payment-status");
        } else {
            // No data received
            // console.log('No transaction data received.');
            // Send a response indicating no data received
            res.status(400).json({ message: 'No transaction data received.' });
        }
    } catch (error) {
        // Handle any error that occurred during request processing
        // console.error('Error processing callback:', error);
        // Send a response indicating internal server error
        res.status(500).json({ message: 'Internal Server Error' }, error);
    }
};

const callback = async (req, res) => {
    try {
        const transactionData = req.body;
        if (Object.keys(transactionData).length > 0) {
            // Data received
            // Perform actions to save the data here
            await saveTransaction(transactionData);

            // Send a success response
            res.status(200).json({ message: 'Received transaction data and saved successfully.', data: transactionData });
        } else {
            // No data received
            res.status(400).json({ message: 'No transaction data received.' });
        }
    } catch (error) {
        // Handle any error that occurred during request processing
        console.error('Error processing callback:', error);
        // Send a response indicating internal server error
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const saveTransaction = async (transactionData) => {
    try {
        const newTransaction = new transaction(transactionData);
        const savedTransaction = await newTransaction.save();
        console.log(saveTransaction)
        return savedTransaction;
    } catch (error) {
        console.error('Error saving transaction:', error);
        throw error;
    }
};

const getcallback = async () => {
    try {
        const allTransactions = await transaction.find({});
        return allTransactions;
    } catch (error) {
        // console.error('Error fetching callback data:', error);
        throw error;
    }
};


export {
    payment,
    saveTransaction,
    getcallback,
    callback,
    callbackNode
}