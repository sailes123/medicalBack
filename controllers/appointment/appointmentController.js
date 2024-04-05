const pool = require("../../database/db");

const createAppointment = async (req, res) => {
  try {

    const user_id = req.user.user_id;
    const { doctor_id,description, appointment_time } = req.body;
    const [result] = await pool.execute(
      "INSERT INTO appointments (patient_id, doctor_id,description, appointment_time) VALUES (?, ?, ?,?)",
      [user_id, doctor_id, description, appointment_time]
    );
    const appointmentObject = {
      appointment_id: result.insertId,
      doctor_id: doctor_id,
      description: description,
      appointment_time: appointment_time
    };

    res.status(200).json({ data: appointmentObject });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error" });
  }
};

module.exports={ createAppointment };  