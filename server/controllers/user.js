import bcrypt from "bcrypt";
import userSchema from "../model/userSchema.js";
import jwt from "jsonwebtoken";
import generateRandomUsername from "../utils/utils.js";

// for new user registration ==============>>>>>>>>>>>>>>>>>>>>>>>>>
export const register = async (req, res, next) => {
  try {
    let { email, password, username } = req.body;
    email = email.toLowerCase();

    username = username || generateRandomUsername(email);

    // checking if email or password are empty
    if (!email || !password) return res.status(501).json({ success: false, msg: "all the fields are required" });

    // checking if the min length of password is greater or equal to 6
    if (password.length < 6) return res.status(501).json({ success: false, msg: "password length must be greater than 5 characters" });

    // checking if the email exists already.
    if (await userSchema.findOne({ email: email })) {
      return res.status(501).json({ success: false, msg: "This email already exists. please use another email." });
    }

    // checking if the username exists already. if it exists then we are generating a random usrname based on their email on the server and setting it to the username variable.
    if (await userSchema.findOne({ username: username })) {
      username = generateRandomUsername(email);
      // adding an extra field to the req obj , so that we can use it later.
      req.extraMsg = "the username you have provided already exists. we are generating a new username for you";
    }

    // now if all the above checks get pass then we are going to store the user in the database.
    const cryptPassword = await bcrypt.hash(password, 10);
    let user = await userSchema.create({ email, username, password: cryptPassword });

    // now creating an auth token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // sending the response to the user
    return res.status(201).json({ success: true, msg: "user created", user: user, token: token, extra: req.extraMsg || null });
  } catch (error) {
    return res.status(501).json({ success: false, error: error.message });
  }
};

// for log in ==============>>>>>>>>>>>>>>>>>>>>>>>>>
export const login = async (req, res, next) => {
  let { email, password } = req.body;
  email = email.toLowerCase();

  if (!email || !password) return res.status(400).json({ success: false, msg: "all the fields are required" });

  let user = await userSchema.findOne({ email: email }, { password: 1 });

  if (!user) return res.status(400).json({ success: false, msg: "this account does not exist." });

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: email, _id: user._id }, process.env.JWT_SECRET);
    return res.status(200).json({ success: true, token: token });
  } else return res.status(200).json({ success: false, msg: "invalid password" });
};

// for forget password ==============>>>>>>>>>>>>>>>>>>>>>>>>>
export const forgetPassword = async (req, res, next) => {
  let { email } = req.body;
  if (!email) return res.status(400).json({ success: false, msg: "email is required" });
  let user = await userSchema.findOne({ email: email });
  if (user) {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });
    return res.status(200).json({ token: token });
  } else return res.status(400).json({ success: false, msg: "this account does not exists" });
};

// for reset password ==============>>>>>>>>>>>>>>>>>>>>>>>>>
export const resetPassword = async (req, res, next) => {
  try {
    let { authorization } = req.headers;
    let { password } = req.body;
    console.log(password);
    let token = authorization.split(" ")[1];
    if (!token) return res.status(400).json({ msg: "you are not authorized" });
    let { _id } = jwt.verify(token, process.env.JWT_SECRET);
    let user = await userSchema.findById(_id);
    if (user) {
      let cryptPass = await bcrypt.hash(password, 10);
      await userSchema.findByIdAndUpdate(_id, { password: cryptPass });
      return res.status(200).json({ msg: "password has successfully changed! Enjoy" });
    } else return res.status(200).json({ msg: "user does not exists" });
  } catch (error) {
    return res.json({ error: error?.message });
  }
};
