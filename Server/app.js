const express = require("express");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api");

const app = express();

// Connect to the MongoDB server
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

// Parse incoming request bodies as JSON
app.use(express.json());

// Use the API routes
app.use("/api", apiRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
