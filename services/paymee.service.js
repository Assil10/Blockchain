const axios = require("axios");
const config = require("../paymee/paymee.config");

exports.createPayment = async ({ amount, note }) => {
  const body = {
    vendor: process.env.PAYMEE_MERCHANT_ID,  // Merchant ID from Paymee
    amount,
    note,
    currency: "TND",  // Tunisian Dinar (change if using another currency)
    back_url: "https://example.com/success",  // URL to redirect after payment
    notify_url: process.env.PAYMEE_CALLBACK_URL,  // Callback URL for Paymee to notify the status
  };

  try {
    // Send POST request to Paymee API to create the payment
    const res = await axios.post(`${config.baseURL}/payments/create`, body, {
      headers: config.headers,  // Authorization and Content-Type headers
    });

    console.log("Paymee response:", res.data); // Log the entire response

    // Check if the response contains the expected structure
    if (res.data && res.data.data) {
      const paymeeRef = res.data.data.token; // Paymee token is used as reference
      const paymentUrl = `https://sandbox.paymee.tn/gateway/${paymeeRef}`;

      // Ensure the response contains the necessary fields
      if (!paymeeRef || !paymentUrl) {
        throw new Error("Missing Paymee token or payment_url.");
      }

      // Return payment URL and amount
      return {
        payment_url: paymentUrl,
        amount: res.data.data.amount,
        token: paymeeRef // Return the token (paymee_ref)
      };
    } else {
      throw new Error("Invalid Paymee response structure.");
    }

  } catch (error) {
    console.error("Paymee error:", error.response?.data || error.message);
    throw new Error('Failed to create payment with Paymee');
  }
};