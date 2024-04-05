const pool = require("../../database/db");

const getDoctorById = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("Helo");
    const [doctors] = await pool.execute(
      "SELECT * FROM profile WHERE user_type = 'doctor' AND profile_id = ?",
      [id]
    );

    const doctorsWithSchedules = await Promise.all(
      doctors.map(async (doctor) => {
        const [schedules] = await pool.execute(
          "SELECT * FROM schedules WHERE doctor_id = ?",
          [doctor.profile_id]
        );
        // 'schedules' will be an empty array if no schedules are found, which is fine

        doctor.schedules = schedules;

        return doctor;
      })
    );

    res.status(200).json({ doctors: doctorsWithSchedules });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error" });
  }
};

const getDoctorList = async (req, res) => {
  try {
    console.log("Helo");
    const [doctors] = await pool.execute(
      "SELECT * FROM profile WHERE user_type = 'doctor'"
    );

    const doctorsWithSchedules = await Promise.all(
      doctors.map(async (doctor) => {
        const [schedules] = await pool.execute(
          "SELECT * FROM schedules WHERE doctor_id = ?",
          [doctor.profile_id]
        );
        // 'schedules' will be an empty array if no schedules are found, which is fine

        doctor.schedules = schedules;

        return doctor;
      })
    );

    res.status(200).json({ doctors: doctorsWithSchedules });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error" });
  }
};

module.exports = { getDoctorById, getDoctorList };
