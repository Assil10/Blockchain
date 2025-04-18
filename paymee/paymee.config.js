module.exports = {
    baseURL: "https://sandbox.paymee.tn/api/v1",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${process.env.PAYMEE_API_KEY}`
    }
  };
  