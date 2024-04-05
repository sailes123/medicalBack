const pool = require("../../database/db");

const fetchMyPrescription = async (req, res) => {
  try {
    const profile_id = req.user.profile_id;

    const [result] = await pool.execute(
      `SELECT p.*, d.profile_id AS doctor_profile_id, d.first_name AS doctor_first_name, d.last_name AS doctor_last_name, d.email AS doctor_email, d.speciality AS doctor_speciality
        FROM prescription AS p
        JOIN profile AS d ON p.doctor_id = d.profile_id
        WHERE p.patient_id = ?
        `,
      [profile_id]
    );
    
    
    console.log(result);
    res.status(200).json({ prescriptions: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { fetchMyPrescription };
