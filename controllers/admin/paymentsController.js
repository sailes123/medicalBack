const pool = require("../../database/db");

const getAllPayments = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM payments");

    res.status(200).json({ payments: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { getAllPayments };
