import express from 'express';
const payment_route = express.Router();

import bodyParser from 'body-parser';
import { payment, callback, callbackNode } from './payment.controller.js';
import { authenticateTokenCookie } from '../../middleware/authenticateToken.js';
payment_route.use(bodyParser.json());
payment_route.use(bodyParser.urlencoded({ extended: false }));
payment_route.post('/initiatePayment', authenticateTokenCookie, payment);
payment_route.post('/callback', authenticateTokenCookie, callback);
payment_route.get('/callbackNode', callbackNode);
// payment_route.post('/payment', payment);
// payment_route.get('/success', success);
// payment_route.get('/failure', failure);
// payment_route.post('/initiatePayment', payment);
// payment_route.post('/callback', async (req, res) => {
//     try {
//         // Extract data from the request body
//         const transactionData = req.body;
//         console.log('transactionData', transactionData)

//         // Process the transaction data (e.g., save it to the database)
//         await saveTransaction(transactionData);

//         // Send a response indicating successful processing
//         res.status(200).send('Callback received and processed successfully.');
//     } catch (error) {
//         // Handle errors
//         console.error('Error processing callback:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// Route to get all callback data
// payment_route.get('/callback', async (req, res) => {
//     try {
//         // Retrieve all transactions from the database
//         const allTransactions = await getcallback();

//         // Send the retrieved transactions as a response
//         res.status(200).json(allTransactions);
//     } catch (error) {
//         // Handle errors
//         console.error('Error fetching callback data:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });
// payment_route.get('/test', async (req, res) => {
//     const allTransactions = await getcallback();
//     console.log('request data', req)
//     res.status(200).json(allTransactions);
// });



export { payment_route };
