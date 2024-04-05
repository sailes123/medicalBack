const pool = require("../../database/db");

//function to list of schedules made by doctor
const getScheduleList = async (req, res) => {
  const profile_id = req.user.profile_id;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM schedules WHERE doctor_id = ?",
      [profile_id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No schedules found for the specified doctor" });
    }
    res.json({ schedules: rows });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving schedules", error: error.message });
  }
};

const getScheduleById = async (req, res) => {
  const { id } = req.params;
  const profile_id = req.user.profile_id;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM schedules WHERE schedule_id = ? AND doctor_id = ?",
      [id, profile_id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No schedules found for the specified doctor" });
    }
    res.json({ schedules: rows });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving schedule", error: error.message });
  }
};

//function to create a schedule by doctor
// {
//   "availableDate": "2024-03-10",
//   "startTime": "08:00:00",
//   "endTime": "12:00:00"
// }
const createSchedule = async (req, res) => {
  const profile_id = req.user.profile_id;
  const { availableDate, startTime, endTime } = req.body;

  console.log(req.user);
  try {
    const [rows] = await pool.query(
      'INSERT INTO schedules (doctor_id, available_date, start_time, end_time, status) VALUES (?, ?, ?, ?, "available")',
      [profile_id, availableDate, startTime, endTime]
    );

    res.status(201).json({
      message: "Schedule created successfully",
      scheduleId: rows.insertId,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error" });
  }
};

//remove schedule using scheduleId
const deleteSchedule = async (req, res) => {
  const { scheduleId } = req.params;

  try {
    await pool.query(
      'DELETE FROM schedules WHERE schedule_id = ? AND status = "available"',
      [scheduleId]
    );
    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error" });
  }
};

module.exports = {
  getScheduleById,
  getScheduleList,
  createSchedule,
  deleteSchedule,
};
