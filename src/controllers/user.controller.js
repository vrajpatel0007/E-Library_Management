const user_service = require("../services/user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const register = async (req, res) => {
  const reqbody = req.body;
  console.log("🚀 ~ register ~ reqbody:", reqbody);
  try {
    if (!reqbody) {
      return res.status(400).json({ message: "Invalid request body" });
    }
    const UserExists = await user_service.findemail(reqbody.Email);
    if (UserExists) {
      return res.status(400).json({ message: "email already exists" });
    }
    const bcrpass = await bcrypt.hash(reqbody.Password, 10);
    console.log("🚀 ~ register ~ bcrpass:", bcrpass)
    const body = {
      Username: reqbody.Username,
      Email: reqbody.Email,
      Password: bcrpass
    }
    console.log("🚀 ~ register ~ body:", body)
    const user = await user_service.register(body);
    console.log("🚀 ~ register ~ user:", user)
    return res
      .status(200)
      .json({ message: "User registered successfully", user });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};


// login
const login = async (req, res) => {
  try {
    const body = req.body;
    console.log("🚀 ~ login ~ body:", body);
    const Password = req.body.Password;
    console.log("🚀 ~ login ~ Password:", Password);
    const user = await user_service.findemail(body.Email);

    console.log("🚀 ~ login ~ body.Email:", body.Email);
    console.log("🚀 ~ login ~ user:", user);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const bcryptpass = await bcrypt.compare(Password, user.Password);
    if (!bcryptpass) {
      return res.status(404).json({ message: "Incorrect Password" });
    }
    const payload = {
      _id: user._id,
      email: user.Email
    };
    console.log("🚀 ~ login ~ payload.email:", payload);
    const token = jwt.sign(payload, process.env.SECRET_key, {
      expiresIn: "1d",
    });
    const toke = res.cookie("token", token)
    console.log("🚀 ~ login ~ token:", token);
    res.status(200).json({ message: "User Login Successful", token: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  register,
  login,
};
