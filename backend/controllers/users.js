const connection = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const email = req.body.email.toLowerCase();

  const {
    password,
    username,
    first_name,
    last_name,
    country,
    profile_image,
    role_id,
  } = req.body;

  const SALT = Number(process.env.SALT);
  const hashPassword = await bcrypt.hash(password, SALT);

  const command = `INSERT INTO users (email ,password ,username , first_name , last_name , country , profile_image , role_id) VALUES (? , ?,? , ?, ? , ?, ? , ?)`;
  const data = [
    email,
    hashPassword,
    username,
    first_name,
    last_name,
    country,
    profile_image,
    role_id,
  ];
  connection.query(command, data, (err, result) => {
    if (err?.sqlMessage.includes(`for key 'users.email`)) {
      return res
        .status(409)
        .json({ success: false, message: "The Email Already Exists" });
    }

    if (err?.sqlMessage.includes(`for key 'users.username`)) {
      return res
        .status(409)
        .json({ success: false, message: "The UserName Already Exists" });
    }

    if (err?.sqlMessage.includes(`'username' cannot be null`)) {
      return res
        .status(409)
        .json({ success: false, message: "The UserName Cannot Be Null" });
    }

    return res.status(201).json({
      success: true,
      message: "Account Created Successfully",
      user: result,
    });
  });
};

///////////signIn////////////////////////////////

const signIn = (req, res) => {
  const password = req.body.password;
  const email = req.body.email.toLowerCase();

  const command = `SELECT * FROM  roles INNER JOIN  users ON users.role_id=roles.id WHERE email=?`;

  const data = [email];
  connection.query(command, data, (err, result) => {
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (err, response) => {
        if (err) res.json(err);
        if (response) {
          const options = {
            expiresIn: process.env.TOKEN_EXP_Time,
          };

          const payload = {
            userId: result[0].id,
            role: result[0].role,
          };
          const secret = process.env.SECRET;

          const token = jwt.sign(payload, secret, options);

          res.status(200).json({
            success: true,
            massage: "Valid Login Credentials",

            token: token,
          });
        } else {
          return res.status(403).json({
            success: false,
            message: `The Password You Have Entered Is Incorrect`,
          });
        }
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "The email doesn't exist" });
    }
  });
};

/////////////////////////////

const getAllUsernames = (req, res) => {
  const command = `SELECT * FROM users WHERE is_deleted=0  ;`;

  connection.query(command, (err, result) => {
    if (result.length > 0) {
      res.status(200).json({
        success: true,
        message: "All The Usernames",
        categories: result,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No User Have Signedin To The Website",
      });
    }

    if (err) {
      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err,
      });
    }
  });
};

module.exports = { signup, signIn, getAllUsernames };