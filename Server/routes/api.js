const express = require("express");
const Row = require("../models/row");

const router = express.Router();

// Function to handle seat reservation requests
async function reserveSeats(req, res) {
  // Extract the number of seats the user wants to reserve from the request body
  const numSeats = req.body.numSeats;

  // Find rows that have at least `numSeats` available seats
  const rows = await Row.find({ "seats.isAvailable": true })
    .where("seats")
    .size(numSeats);

  // If no rows are found, return an error message
  if (rows.length === 0) {
    return res.send({
      error: "Sorry, there are no rows with enough available seats.",
    });
  }

  // Otherwise, reserve the seats in the first row that has enough available seats
  const row = rows[0];
  row.seats = row.seats.map((seat) => {
    if (seat.isAvailable && numSeats > 0) {
      seat.isAvailable = false;
      numSeats--;
    }
    return seat;
  });

  // Save the updated row to the database
  await row.save();

  // Return the reserved seat numbers to the client
  const reservedSeats = row.seats
    .filter((seat) => !seat.isAvailable)
    .map((seat) => seat.number);

  res.send({ reservedSeats });
}

// GET /api/seat-availability
// Returns the seat availability status
router.get("/seat-availability", async (req, res) => {
  // Find all rows in the database
  const rows = await Row.find();

  // Return the seat availability status for each row
  res.send(
    rows.map((row) => ({
      _id: row._id,
      seats: row.seats,
    }))
  );
});

// POST /api/reserve-seats
// Reserves seats in the train
router.post("/reserve-seats", reserveSeats);

module.exports = router;
