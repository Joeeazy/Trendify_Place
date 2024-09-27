import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

//create two diffrent tokens save the refreshtoken to the redisdb
const generateTokens = (userId) => {
  //get an access token which expires in 15mins
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  //get an refresh token which expires in 7days
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

//store the refreshToken in redisdb
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token: ${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); //expires in 7days
};

//fucntion to set cookies
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    //make more secure
    httpOnly: true, //prevents XSS attacks , cross site scripting attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevents CSRF attacks, Cross-site request forgery
    maxAge: 15 * 60 * 1000, //15 minutes in miliseconds
  });
  res.cookie("refreshToken", refreshToken, {
    //make more secure
    httpOnly: true, //prevents XSS attacks , cross site scripting attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevents CSRF attacks, Cross-site request forgery
    maxAge: 7 * 24 * 60 * 60 * 1000, //7days in miliseconds
  });
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    //check if user exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    //if user doesnt exist create new user in the mongodb
    const user = await User.create({ name, email, password });

    //authenticate user
    //create two diffrenet tokens access token and a refresh token
    const { accessToken, refreshToken } = generateTokens(user._id);
    //store the refreshcookie
    await storeRefreshToken(user._id, refreshToken);

    //set tokens into a cookie
    setCookies(res, accessToken, refreshToken);

    //send a response to client success message
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "user Created Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
  } catch (error) {}
};

export const logout = async (req, res) => {
  //delete both cookies, accesstoken and refreshtoken
  try {
    //get the refreshToken
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      //if it exists delete it from  redisdb
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refreshToken: ${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged Out successfully" });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};
