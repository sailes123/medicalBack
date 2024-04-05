const pool = require("../../database/db");
const axios = require("axios");

const payForCall = async (req, res) => {
  const profile_id = req.user.profile_id;
  const { amount } = req.body;

  try {
 
    const data = {
      return_url: "http://localhost:3000/success",
      website_url: "http://localhost:3000/",
      amount: "1000",
      purchase_order_id: "afadsfasdf",
      purchase_order_name: "asdfasdfasdf",
    };

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      data,
      {
        headers: {
          Authorization: "Key ab096ad365914bbd9983e0e8f8c2396c0",
          "Content-Type": "application/json",
          
        },
      }
    );

    //if(response.status === 200 || response.status === 201)

    console.log(response.data);

    const [result] = await pool.execute(
      "INSERT INTO payments ( patient_id, token, amount) VALUES (?, ?, ?)",
      [profile_id, response.data.pidx, amount]
    );

    res.status(200).json({ message: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPaymentList = async (req, res) => {
  try { 
    const profile_id = req.user.profile_id;

    const [rows] = await pool.execute(
      "SELECT * FROM payments WHERE patient_id = ?",
      [profile_id]
    );

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyToken = async (req, res) => {
  try {
  
    const { token } = req.body;

    const [rows] = await pool.execute(
      "SELECT * FROM payments WHERE token = ?",
      [token]
    );

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: "No payments found for this token" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { payForCall, getPaymentList, verifyToken };
