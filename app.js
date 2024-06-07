const config = require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors")

// Require routes
const routes = require("./routes");

const app = express();

const start = async () => {
  const port = process.env.PORT || 5000;

  try {
    // Parse JSON body
    app.use(express.json());

    // Enable CORS
    app.use(cors())

    // Log requests to console
    app.use((req, res, next) => {
      console.log(req.path, req.method);
      next();
    });

    // Serve routes
    app.use("/api(|/).{0}$", (req, res) => {
        res.status(200).send("Aan API");
    });
    app.use("/api", routes)
    app.use("*", (req, res) => {
        res.status(404).send("Aan");
    });

    // Serve static files
    // app.use('/',express.static(__dirname+'/public'))

    // DB connection
    mongoose.connect(process.env.MONGO_URI);
    console.log(`DB connection successful`);
    
    // Listen to incoming requests
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    
  } catch (e) {
    console.log(e);

    app.listen(port);

    app.get('*', (req, res) => {
      res.status(503).send();
    });

  }
}

start();
