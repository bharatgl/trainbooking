const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  number: Number,
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const rowSchema = new mongoose.Schema({
  seats: [seatSchema],
});

module.exports = mongoose.model("Row", rowSchema);
