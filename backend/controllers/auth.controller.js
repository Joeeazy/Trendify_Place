import User from "../models/user.model.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    //check if user exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    //create new user
    const user = await User.create({ name, email, password });

    //authenticate user

    //send a message
    res.status(201).json({ user, message: "user Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  res.send("login Route called");
};

export const logout = async (req, res) => {
  res.send("logout Route called");
};
