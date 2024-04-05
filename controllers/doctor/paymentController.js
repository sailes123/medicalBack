const pool = require("../../database/db");
const { generateRandomString } = require("../../utils");

const getPaymentList = async (req, res) => {
  try {
    const profile_id = req.user.profile_id;

    const [rows] = await pool.execute(
      "SELECT * FROM payments WHERE doctor_id = ?",
      [profile_id]
    );

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: "No payments found for this patient" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const generateCallToken = async (req, res) => {
  try {
    const { patientId } = req.body;
    const [result] = await pool.execute(
      "INSERT INTO payments ( patient_id, token, amount) VALUES (?, ?, ?)",
      [patientId, generateRandomString(), 1000]
    );

    res.status(200).json({ message: "done" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const clearToken = async (req, res) => {
  try {
    const profile_id = req.user.profile_id;
    const { token, patient_id } = req.body;

    const [doctor] = await pool.execute(
      "SELECT * FROM profile WHERE profile_id = ?",
      [profile_id]
    );

    if (doctor.length === 0) {
      res.status(404).json({ message: "No doctor found" });
    }

    if (doctor[0].doctor_type === "Specialist") {
      const [specialist] = await pool.execute(
        "UPDATE payments SET specialist_call = 0 WHERE token = ? ",
        [token]
      );

      console.log(specialist);
    } else {
      const [physician] = await pool.execute(
        "UPDATE payments SET physician_call = 0 WHERE token = ? ",
        [token]
      );

      console.log(physician);
    }

    const [doctor_patient] = await pool.execute(
      `INSERT INTO doctor_patient (
        doctor_id,
        patient_id
      ) VALUES (?,?)`,
      [profile_id, patient_id]
    );

    console.log("Doctor patient",doctor_patient);
    res.status(200).json({ message: "done" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getPaymentList, generateCallToken, clearToken };
