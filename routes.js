const express = require("express");
const { login, register, getProfile, getData, setProfile, setData } = require("./controller");
const router = express.Router();

// Login
router.post("/login", login);

// Register
router.post("/register", register);

// Get profile
router.get("/profile", getProfile);

// Set profile
router.post("/profile", setProfile);

// Get all IoT data
router.get("/data", getData);

// Set (upload) IoT data
router.post("/data", setData);

module.exports = router;
