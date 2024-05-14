const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Import model
const Device = require("./model");

const login = async (req, res) => {
    try {
      const { device_id, password } = req.body;
  
      const user = await Device.findOne({ device_id }).select('name location');
      if (!user || !device_id || !password) throw new Error("Invalid login");
  
      if (!bcrypt.compareSync(password, user.password))
        throw new Error("Invalid login");
  
      const token = jwt.sign(
        { name: user.name, device_id },
        process.env.JWT_SECRET
      );
  
      res
        .status(200)
        .json({ name: user.name, device_id, location: user.location, token });
    } catch (e) {
      console.error(e);
      e.message === "Invalid login"
        ? res.status(400).json({ message: e.message })
        : res.status(500).send();
    }
  };

const register = async (req, res) => {
    try {
      password = bcrypt.hashSync(req.body.password);
      console.log(password)
      const newDevice = new Device({ "device_id": req.query.device_id, password: password });
      await newDevice.save();
      res.status(201).json({
        _id: newDevice._id,
        name: newDevice.name,
        location: newDevice.location,
        device_id: newDevice.device_id,
        createdAt: newDevice.createdAt,
      });
    } catch (e) {
      if (e.name === "ValidationError")
        return res.status(400).json({ message: e.message });
      if (e.message.includes("E11000"))
        return res.status(400).json({ message: "Duplicate device ID" });
      console.error(e);
      res.status(500).send();
    }
};

const getProfile = async (req, res) => {
    const { authorization } = req.headers;
  
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  
    const token = authorization.split(" ")[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET).select('name location device_id');
      const device = await Device.findOne({ device_id: decoded.device_id });
      res
        .status(200)
        .json(device);
    } catch (e) {
      console.error(e);
      res.status(401).json({ message: "Unauthorized" });
    }
};

const setProfile = async (req, res) => {
    // Check auth header
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });

    // Verify JWT
    let decoded = {};
	try {
        decoded = jwt.verify(token, process.env.JWT_SECRET).select('name location device_id');
    } catch (e) {
        console.error(e);
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Check params
	const allowedUpdates = ['name', 'location', 'password'];
	const updates = Object.keys(req.body);
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);
	if (!isValidOperation || updates.length === 0) {
		return res.status(400).json({ error: 'Invalid update parameter' });
	}

    const { name, location, password } = req.body;

    try {
        // Validate paket ID
        const device = await Device.findById(decoded.device_id);
        if (!device) {
        return res.status(404).json('Device not found');
        }

        // Update paket data
        if (name) device.name = name;
        if (location) device.location = location;
        if (password) device.password = bcrypt.hashSync(password);

        // Save changes
        await device.save();

        res.json({ message: 'Update success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getData = async (req, res) => {
    const { authorization } = req.headers;
  
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  
    const token = authorization.split(" ")[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET).select('name location device_id');
      const device = await Device.findOne({ device_id: decoded.device_id }).select('data');
      res
        .status(200)
        .json(device.data);
    } catch (e) {
      console.error(e);
      res.status(401).json({ message: "Unauthorized" });
    }
}

const setData = async (req, res) => {
    try {
        // Validate paket ID
        const device = await Device.findById(req.params.device_id);
        if (!device) {
        return res.status(404).send('Device not found');
        }

        // Update data list
        device.data.unshift(req.body)

        // Save changes
        await device.save();

        res.json({ message: 'Update success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    login,
    register,
    getProfile,
    setProfile,
    getData,
    setData,
};
  