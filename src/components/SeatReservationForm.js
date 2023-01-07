import React, { useState, useEffect } from "react";
import axios from "axios";

function SeatReservationForm() {
  // Use React state to store the number of seats the user wants to reserve
  const [numSeats, setNumSeats] = useState(0);
  // Use React state to store the seat availability status
  const [seatAvailability, setSeatAvailability] = useState([]);
  // Use React state to store any error messages
  const [errorMessage, setErrorMessage] = useState(null);
  // Use React state to store the seat numbers that have been reserved
  const [reservedSeats, setReservedSeats] = useState([]);

  // Fetch the seat availability status when

  useEffect(() => {
    async function fetchSeatAvailability() {
      const response = await axios.get("/api/seat-availability");
      setSeatAvailability(response.data);
    }
    fetchSeatAvailability();
  }, []);

  // Function to handle form submission
  async function handleSubmit(event) {
    event.preventDefault();

    // Send a request to the backend API to reserve the seats
    const response = await axios.post("/api/reserve-seats", { numSeats });

    // If the reservation was successful, update the component state to reflect the reserved seats
    if (response.data.reservedSeats) {
      setReservedSeats(response.data.reservedSeats);
      setErrorMessage(null);
    } else {
      // Otherwise, display an error message
      setErrorMessage(response.data.error);
    }
  }

  return (
    <div>
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Number of seats:
          <input
            type="number"
            value={numSeats}
            onChange={(event) => setNumSeats(event.target.value)}
          />
        </label>
        <button type="submit">Reserve seats</button>
      </form>
      <table>
        <tbody>
          {seatAvailability.map((row) => (
            <tr key={row._id}>
              {row.seats.map((seat) => (
                <td
                  key={seat.number}
                  className={seat.isAvailable ? "available" : "reserved"}
                >
                  {seat.number}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default SeatReservationForm