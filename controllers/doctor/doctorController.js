const pool = require("../../database/db");

const getAllAppointments = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const [result] = await pool.execute(
      "SELECT * FROM appointments WHERE doctor_id = ?",
      [user_id]
    );

    console.log(result);

    res.status(200).json({ data: result });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error" });
  }
};

module.exports = { getAllAppointments };
