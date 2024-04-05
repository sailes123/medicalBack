const pool = require("../../database/db");

//get all users list
const getAllUsers = async (req, res) => {
  try {
    const [profiles] = await pool.execute("SELECT * FROM profile");

    res.status(200).json({ users: profiles });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching profiles", error: error.message });
  }
};

const getSingleUsers = async (req, res) => {
  const { id } = req.params;

  try {
    const query = "SELECT * FROM profile WHERE profile_id = ?";
    const [profile] = await pool.execute(query, [id]);

    if (profile.length > 0) {
      res.status(200).json({ user: profile[0] });
    } else {
      res.status(404).send({ message: "Profile not found" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching profile", error: error.message });
  }
};

//create doctor
const createDoctor = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      gender,
      age,
      address,
      speciality,
      doctor_type
    } = req.body;

    console.log(req.file);
    //Fetch user with email
    const [users] = await pool.execute(
      "SELECT * FROM auth WHERE email = ? LIMIT 1",
      [email]
    );

    //check if user with email exist
    if (users.length > 0) {
      return res.status(401).json({ message: "User already registerd" });
    }
    //Create user with email password and type
    const [newUser] = await pool.execute(
      "INSERT INTO auth (email, password, user_type) VALUES (?, ?, ?)",
      [email, password, "doctor"]
    );

    //Create profile with foregin key auth_id frm user
    const [profileResponse] = await pool.execute(
      `INSERT INTO profile (
        auth_id,
        profileUrl,
        first_name,
        last_name,
        email,
        user_type,
        gender,
        age,
        address,
        speciality,
        doctor_type
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [
        newUser.insertId,
        req.file.path,
        first_name,
        last_name,
        email,
        "doctor",
        gender,
        age,
        address,
        speciality,
        doctor_type
      ]
    );

    res.status(201).json({ doctor: profileResponse });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error" });
  }
};

const updateDoctorProfile = async (req, res) => {
  const { id } = req.params;
  const {
    auth_id,
    first_name,
    last_name,
    email,
    user_type,
    gender,
    age,
    address,
    speciality,
    doctor_type
  } = req.body;

  try {
    const query = `UPDATE profile SET 
      auth_id = ?, 
      first_name = ?, 
      last_name = ?, 
      email = ?, 
      user_type = ?, 
      gender = ?,
      age = ?,
      address = ?,
      speciality = ?,
      doctor_type = ?
      WHERE profile_id = ?`;
    const [result] = await pool.execute(query, [
      auth_id,
      first_name,
      last_name,
      email,
      user_type,
      gender,
      age,
      address,
      speciality,
      doctor_type,
      id,
    ]);

    if (result.affectedRows > 0) {
      res.status(200).send({ message: "Profile updated successfully" });
    } else {
      res.status(404).send({ message: "Profile not found" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating profile", error: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  const { id } = req.params;

  try {
    const query = "DELETE FROM profile WHERE auth_id = ?";
    const [result] = await pool.execute(query, [id]);

    const [response] = await pool.execute(
      "DELETE FROM auth WHERE user_id = ?",
      [id]
    );

    if (result.affectedRows > 0 && response.affectedRows > 0) {
      res.status(200).send({ message: "Profile deleted successfully" });
    } else {
      res.status(404).send({ message: "Profile not found" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting profile", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getSingleUsers,
  createDoctor,
  updateDoctorProfile,
  deleteDoctor,
};
