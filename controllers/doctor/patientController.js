const pool = require("../../database/db");

const getMyPatientList = async (req, res) => {
  try {
    const profile_id = req.user.profile_id;
    const [patients] = await pool.execute(
      "SELECT p.* FROM doctor_patient dp JOIN profile p ON dp.patient_id = p.profile_id WHERE dp.doctor_id = ?",
      [profile_id]
    );

    const patientWithPrescriptions = await Promise.all(
      patients.map(async (row) => {
        const [prescription] = await pool.execute(
          "SELECT * FROM prescription WHERE doctor_id = ? AND patient_id = ?",
          [profile_id, row.profile_id]
        );
        
        row.prescriptions = prescription;

        return row;
      })
    );



    console.log(patientWithPrescriptions);
    res.status(201).json({ patients: patientWithPrescriptions });
  } catch (error) {
    res.status(400).send({ message: "Error" });
  }
};

module.exports = { getMyPatientList };
