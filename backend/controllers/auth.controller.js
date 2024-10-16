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
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    //get the user password and email
    const { email, password } = req.body;
    //check f email exists
    const user = await User.findOne({ email });
    // if the user exists and passwords match
    if (user && (await user.comparePassword(password))) {
      //generate tokens
      const { accessToken, refreshToken } = generateTokens(user._id);

      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });
  }
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
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    //check if refresh Token exists
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token found" });
    }
    //else Verify token using secret key
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    //compare refreshtoken provided with that stored in redisdb
    const storedToken = await redis.get(`refresh_token: ${decoded.userId}`);

    //if the dont match
    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    //if refresh token is valid enerate new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesize: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token Refreshed Successfully" });
  } catch (error) {
    console.log("error in the refresh access token controller", error.message);
    res.status(500).jsone({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
