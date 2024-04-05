const pool = require("../../database/db");

const prescribe = async (req, res) => {
  try {
    const profile_id = req.user.profile_id;
    const { patient_id, description } = req.body;

    const [result] = await pool.execute(
      "INSERT INTO prescription ( doctor_id, patient_id, description) VALUES (?, ?, ?)",
      [profile_id, patient_id, description]
    );

    console.log(result);
    res.status(200).json({ message: "done" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { prescribe };
