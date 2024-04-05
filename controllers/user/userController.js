const pool = require("../../database/db");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.execute(
      "SELECT * FROM auth WHERE email = ? LIMIT 1",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not registerd" });
    }
    // User exists, now compare the password
    const user = users[0];

    if (password !== user.password) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    console.log(user);
    const [profile] = await pool.execute(
      "SELECT * FROM profile WHERE auth_id = ? LIMIT 1",
      [user.user_id]
    );

    console.log(profile[0]);
    const token = jwt.sign(
      {
        user_id: user.user_id,
        profile_id: profile[0].profile_id,
        user_type: user.user_type,
      },
      "secretKey",
      {
        expiresIn: "10d", // Token expiration time
      }
    );

    res.status(201).json({ token: token });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error" });
  }
};

const register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      gender,
      age,
      address,
      dieseses,
    } = req.body;

    console.log(req.file);

    const [users] = await pool.execute(
      "SELECT * FROM auth WHERE email = ? LIMIT 1",
      [email]
    );

    if (users.length > 0) {
      return res.status(401).json({ message: "User already registerd" });
    }
    const [newUser] = await pool.execute(
      "INSERT INTO auth (email, password, user_type) VALUES (?, ?, ?)",
      [email, password, "patient"]
    );

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
      dieseses
      ) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        newUser.insertId,
        req.file.path,
        first_name,
        last_name,
        email,
        "patient",
        gender,
        age,
        address,
        dieseses,
      ]
    );
    const token = jwt.sign(
      {
        user_id: newUser.insertId,
        profile_id: profileResponse.insertId,
        user_type: "patient",
      },
      "secretKey",
      {
        expiresIn: "10d", // Token expiration time
      }
    );

    res.status(201).json({ token: token });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error" });
  }
};

const registerNoProfile = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      gender,
      age,
      address,
      dieseses,
    } = req.body;



    const [users] = await pool.execute(
      "SELECT * FROM auth WHERE email = ? LIMIT 1",
      [email]
    );

    if (users.length > 0) {
      return res.status(401).json({ message: "User already registerd" });
    }
    const [newUser] = await pool.execute(
      "INSERT INTO auth (email, password, user_type) VALUES (?, ?, ?)",
      [email, password, "patient"]
    );

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
      dieseses
      ) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        newUser.insertId,
        "image path",
        first_name,
        last_name,
        email,
        "patient",
        gender,
        age,
        address,
        dieseses,
      ]
    );
    const token = jwt.sign(
      {
        user_id: newUser.insertId,
        profile_id: profileResponse.insertId,
        user_type: "patient",
      },
      "secretKey",
      {
        expiresIn: "10d", // Token expiration time
      }
    );

    res.status(201).json({ token: token });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const [profile] = await pool.execute(
      "SELECT * FROM profile WHERE auth_id = ?",
      [user_id]
    );

    res.status(200).json({ profile: profile });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error" });
  }
};

module.exports = { login, register, getProfile,registerNoProfile };
