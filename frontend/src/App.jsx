
import { useState } from "react";
import "./App.css";
import Login from "./login.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTheater, setSelectedTheater] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [snacks, setSnacks] = useState({});
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [paymentApp, setPaymentApp] = useState("");

 
const movies = [
  // Prabhas Movies
  { title: "Varsham", language: "Telugu", type: "Romance", image: "https://sund-images.sunnxt.com/11240/500x750_Varsham_11240_f3f30651-fedd-4f9d-9a8c-fb49f90b9835.jpg" },
  { title: "Chatrapathi", language: "Telugu", type: "Action", image: "https://a.ltrbxd.com/resized/film-poster/6/5/6/5/9/65659-chatrapathi-0-600-0-900-crop.jpg?v=8c71cd8f2f" },
  { title: "Pournami", language: "Telugu", type: "Drama", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtx8t7EOb9lNj_PalaM6g_w37k9XF-w6X95HSrm00Sew&s=10" },
  { title: "Yogi", language: "Telugu", type: "Action", image: "https://m.media-amazon.com/images/M/MV5BYjc2ZTI4ZjgtYzZkNy00NDc4LTk2Y2ItMzg1ZTY2MzVlMzg4XkEyXkFqcGc@._V1_.jpg" },
  { title: "Darling", language: "Telugu", type: "Romance", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX75rP23s-wybsRGXjyzgI4jiJLHjomEXs6kNiDY1ZoH-E782jbtxsr24x&s=10" },
  { title: "Mr. Perfect", language: "Telugu", type: "Romance", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSudpd9gj_gThbcb83KiXRKoQAAGYXE_JmJozdpZPHnfrRBPiFsNp0oI2E&s=10" },
  { title: "Rebel", language: "Telugu", type: "Action", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS3CepKfupoZgooG1krVGaWfrExkwd7vvdG5Mj3lYZWGGC1QjAUwOHtiyF&s=10" },
  { title: "Mirchi", language: "Telugu", type: "Action", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6OlPn4ET99mxwOrShiy-nhx6mplqdnYPDZT9KTpjIQK6t5YI8QrTHMPw&s=10" },
  { title: "Baahubali 1: The Beginning", language: "Telugu", type: "Action", image: "https://c8.alamy.com/comp/HAH93T/bahubali-the-beginning-year-2015-india-director-ss-rajamouli-prabhas-HAH93T.jpg" },
  { title: "Baahubali 2: The Conclusion", language: "Telugu", type: "Action", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSztigzt5WjA8ieUguL5g0NE76b0IjSTz27Gj0qNh0e3t3J0W3rbZUqYBey&s=10" },
  { title: "Saaho", language: "Telugu", type: "Action", image: "https://m.media-amazon.com/images/M/MV5BODllODJhNzYtNTE0OC00ZTdmLWE3NWQtNGNkM2JjMWZhM2MwXkEyXkFqcGc@._V1_.jpg" },
  { title: "Radhe Shyam", language: "Telugu", type: "Romance", image: "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p19625410_p_v10_ab.jpg" },
  { title: "Adipurush", language: "Telugu", type: "Mythological", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjDkN9_4OTZW-QvphroRCYIiphLej4jK6Dbdzt7-dyHK_yKvNdURsXtXs&s=10" },
  { title: "Salaar: Part 1 – Ceasefire", language: "Telugu", type: "Action", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTTVheKiOipyr4Px0P7ogaaHNWPFdOp57oT6SrMontTb-ULMNYIK8BN_Vv&s=10" },
  { title: "Kalki 2898 AD", language: "Telugu", type: "Sci-Fi", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkRk6oEydBR2ote1BBo3TykPocin8LIOV16j6p359pkw&s=10" },
  { title: "The Raja Saab", language: "Telugu", type: "Horror Comedy", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcT1r-8p59nhHqai_6vj5or8rpFQ7axQOHuU9Ss9H4sQ&s=10" },
  
// Upcoming Movies
{ title: "Fauzi", language: "Telugu", type: "Action", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdima589undvecJAEq1J1_SY0B-M7ePUHuAOHlnABV7w&s=10" },
{ title: "Spirit", language: "Telugu", type: "Action", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSddmKY9QrwdtZGhubL9gsB4BxBN_08-emQnLLWkcLZflDDKNINsoZ7VYle&s=10" },
{ title: "Salaar Part 2: Shouryaanga Parvam", language: "Telugu", type: "Action", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgtfzotTht88CtXlUD8EJxbXkyi_9J8N8V-Ht6Yz7SOw&s=10" },
{ title: "Kalki 2898 AD Part 2", language: "Telugu", type: "Sci-Fi", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxigfKgNynOgKFviOco9_-HRHYg_gDfiY8vx0YTl7x7g&s=10" }
];


  const theaters = [
    { name: "PVR Cinemas", location: "Hyderabad", times: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"] },
    { name: "INOX", location: "Hyderabad", times: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"] },
    { name: "AMB Cinemas", location: "Gachibowli, Hyderabad", times: ["10:30 AM", "1:30 PM", "6:00 PM", "9:30 PM"] },
    { name: "Cinepolis", location: "Hyderabad", times: ["9:30 AM", "12:30 PM", "4:30 PM", "7:30 PM"] },
  ];

  const seatList = [
    "A1", "A2", "A3", "A4", "A5",
    "B1", "B2", "B3", "B4", "B5",
    "C1", "C2", "C3", "C4", "C5",
    "D1", "D2", "D3", "D4", "D5",
  ];

  const snackMenu = [
    { id: "popcorn", name: "Classic Popcorn", price: 150, emoji: "🍿" },
    { id: "largePopcorn", name: "Large Popcorn", price: 250, emoji: "🍿" },
    { id: "coke", name: "Coke", price: 100, emoji: "🥤" },
    { id: "nachos", name: "Cheese Nachos", price: 180, emoji: "🧀" },
    { id: "combo", name: "Popcorn + Coke Combo", price: 220, emoji: "🍿" },
    { id: "burger", name: "Veg Burger", price: 160, emoji: "🍔" },
  ];

  const offers = [
    { code: "MOVIE10", title: "10% OFF on tickets", description: "Get 10% off your ticket subtotal.", detail: "Select at least one seat to use this offer." },
    { code: "SNACK50", title: "₹50 OFF your snacks", description: "Save ₹50 when your snacks cost ₹200 or more.", detail: "Valid on snack orders of ₹200 or more." },
  ];

  const today = [
    new Date().getFullYear(),
    String(new Date().getMonth() + 1).padStart(2, "0"),
    String(new Date().getDate()).padStart(2, "0"),
  ].join("-");

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  const selectedTheaterData = theaters.find(
    (theater) => theater.name === selectedTheater
  );

  const availableShowTimes = selectedTheaterData?.times || [];

  const getSeatPrice = (seat) =>
    seat.startsWith("A") || seat.startsWith("B") ? 250 : 180;

  const ticketTotal = selectedSeats.reduce(
    (total, seat) => total + getSeatPrice(seat),
    0
  );

  const snackTotal = snackMenu.reduce(
    (total, snack) => total + snack.price * (snacks[snack.id] || 0),
    0
  );

  const discount =
    appliedCoupon === "MOVIE10"
      ? Math.round(ticketTotal * 0.1)
      : appliedCoupon === "SNACK50" && snackTotal >= 200
        ? 50
        : 0;

  const grandTotal = ticketTotal + snackTotal - discount;

  const startBooking = (movie) => {
    setSelectedMovie(movie);
    setSelectedDate("");
    setSelectedTheater("");
    setSelectedTime("");
    setSelectedSeats([]);
    setSnacks({});
    setCoupon("");
    setAppliedCoupon("");
    setPaymentApp("");
    setCurrentStep(1);
  };

  const applyCoupon = (code = coupon) => {
    const normalized = (code || "").trim().toUpperCase();

    if (normalized === "MOVIE10") {
      if (ticketTotal === 0) {
        alert("Select at least one seat first.");
        return false;
      }
      setCoupon("MOVIE10");
      setAppliedCoupon("MOVIE10");
      return true;
    }

    if (normalized === "SNACK50") {
      if (snackTotal < 200) {
        alert("Add snacks worth at least ₹200 first.");
        return false;
      }
      setCoupon("SNACK50");
      setAppliedCoupon("SNACK50");
      return true;
    }

    setAppliedCoupon("");
    alert("Invalid coupon code.");
    return false;
  };

  const nextStep = () => {
    if (currentStep === 0) {
      alert("Please select a movie first.");
      return;
    }

    if (currentStep === 1) {
      if (!selectedTheater || !selectedTime || !selectedDate) {
        alert("Please select a theater, showtime, and date.");
        return;
      }
      if (selectedDate < today) {
        alert("Please select today or a future date.");
        return;
      }
    }

    if (currentStep === 2 && selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    if (currentStep === 4 && coupon.trim() && !appliedCoupon) {
      if (!applyCoupon(coupon)) return;
    }

    if (currentStep === 5) {
      setCurrentStep(6);
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, 6));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const previousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateSnack = (id, change) => {
    setSnacks((previous) => ({
      ...previous,
      [id]: Math.max(0, (previous[id] || 0) + change),
    }));

    if (appliedCoupon === "SNACK50") {
      setAppliedCoupon("");
    }
  };

  const confirmPayment = () => {
    if (!paymentApp) {
      alert("Please select a UPI app.");
      return;
    }

    alert(
      `Demo booking confirmed!\n\n` +
      `Movie: ${selectedMovie.title}\n` +
      `Theater: ${selectedTheater}\n` +
      `Date: ${selectedDate}\n` +
      `Show: ${selectedTime}\n` +
      `Seats: ${selectedSeats.join(", ")}\n` +
      `Snacks total: ₹${snackTotal}\n` +
      `Coupon: ${appliedCoupon || "None"}\n` +
      `Discount: ₹${discount}\n` +
      `Total: ₹${grandTotal}\n` +
      `Selected app: ${paymentApp}\n\n` +
      `Demo only. No payment was made.`
    );
  };

  if (!isLoggedIn) {
  return (
    <Login
      onLogin={() => {
        console.log("Login clicked — showing MovieBook");
        setIsLoggedIn(true);
      }}
    />
  );
}

  const pageNames = [
    "Movies",
    "Theaters",
    "Seats",
    "Snacks",
    "Offers",
    "Summary",
    "Payment",
  ];

  return (
    <div className="app">
 ```jsx
<nav className="navbar">
  <div className="logo">🎬 MovieBook</div>

  <div className="nav-links">
    <button
      type="button"
      onClick={() => setCurrentStep(0)}
    >
      Movies
    </button>

    <button
      type="button"
      onClick={() => setCurrentStep(1)}
    >
      Theaters
    </button>

    <button
      type="button"
      onClick={() => setCurrentStep(4)}
    >
      Offers
    </button>

    <button
      type="button"
      onClick={() => setCurrentStep(3)}
    >
      Snacks
    </button>
  </div>
</nav>
```


      <section className="info-section">
        <h2>🎟️ PRABHAS MOVIES </h2>

        <div className="showtime-buttons">
          {pageNames.map((name, index) => (
            <button
              key={name}
              type="button"
              className={currentStep === index ? "showtime-btn active-showtime" : "showtime-btn"}
              onClick={() => {
                if (index === 0 || selectedMovie) setCurrentStep(index);
                else alert("Please select a movie first.");
              }}
            >
              {index + 1}. {name}
            </button>
          ))}
        </div>
      </section>

      {/* PAGE 1: MOVIES */}
      {currentStep === 0 && (
        <section className="movies-section" id="movies">
          <h2>🎥 Choose Your Movie</h2>
          <input
            type="text"
            placeholder="Search for movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <div className="movie-card" key={movie.title}>
                <img
                  src={movie.image}
                  alt={movie.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      `https://placehold.co/300x450/222222/ffffff?text=${encodeURIComponent(movie.title)}`;
                  }}
                />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.language} • {movie.type}</p>
                  <button
                    type="button"
                    className="book-btn"
                    onClick={() => startBooking(movie)}
                  >
                    Select Movie
                  </button>
                </div>
              </div>
            ))}
            {filteredMovies.length === 0 && <p>No movies found.</p>}
          </div>
        </section>
      )}

      {/* PAGE 2: THEATERS AND SHOWTIMES */}
      {currentStep === 1 && (
        <section className="booking-section">
          <h2>🏢 Select Theater & Show</h2>
          <div className="booking-card">
            <h3>{selectedMovie?.title}</h3>

            <label htmlFor="theater-select">Choose Theater</label>
            <select
              id="theater-select"
              value={selectedTheater}
              onChange={(e) => {
                setSelectedTheater(e.target.value);
                setSelectedTime("");
                setSelectedSeats([]);
                setAppliedCoupon("");
              }}
            >
              <option value="">-- Choose a theater --</option>
              {theaters.map((theater) => (
                <option key={theater.name} value={theater.name}>
                  {theater.name} — {theater.location}
                </option>
              ))}
            </select>

            <label>Choose Show Time</label>
            <div className="showtime-buttons">
              {availableShowTimes.map((time) => (
                <button
                  key={time}
                  type="button"
                  className={selectedTime === time ? "showtime-btn active-showtime" : "showtime-btn"}
                  onClick={() => {
                    setSelectedTime(time);
                    setSelectedSeats([]);
                    setAppliedCoupon("");
                  }}
                >
                  {time}
                </button>
              ))}
            </div>

            <label htmlFor="booking-date">Choose Date</label>
            <input
              id="booking-date"
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSeats([]);
                setAppliedCoupon("");
              }}
            />
          </div>
        </section>
      )}

      {/* PAGE 3: SEATS */}
      {currentStep === 2 && (
        <section className="seats-section">
          <h2>💺 Select Your Seats</h2>
          <p>{selectedMovie?.title} • {selectedTheater}</p>
          <p>{selectedDate} • {selectedTime}</p>
          <div className="screen">SCREEN</div>

          <div className="seat-grid">
            {seatList.map((seat) => (
              <button
                key={seat}
                type="button"
                className={selectedSeats.includes(seat) ? "seat selected-seat" : "seat"}
                onClick={() => {
                  setSelectedSeats((previous) =>
                    previous.includes(seat)
                      ? previous.filter((item) => item !== seat)
                      : [...previous, seat]
                  );
                  setAppliedCoupon("");
                }}
              >
                {seat}
              </button>
            ))}
          </div>

          <div className="seat-summary">
            <h3>Your Ticket Summary</h3>
            <p>Selected seats: {selectedSeats.join(", ") || "None selected"}</p>
            <p>Number of seats: {selectedSeats.length}</p>
            <p>Rows A–B: ₹250 per seat</p>
            <p>Rows C–D: ₹180 per seat</p>
            <h3>Ticket Total: ₹{ticketTotal}</h3>
          </div>
        </section>
      )}

      {/* PAGE 4: SNACKS */}
      {currentStep === 3 && (
        <section className="info-section snacks-section">
          <h2>🍿 Snacks & Beverages</h2>
          <p>Choose your favorite cinema snacks.</p>

          <div className="snack-grid">
            {snackMenu.map((snack) => (
              <div className="snack-card" key={snack.id}>
                <div className="snack-emoji">{snack.emoji}</div>
                <h3>{snack.name}</h3>
                <p className="snack-price">₹{snack.price}</p>

                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() => updateSnack(snack.id, -1)}
                    disabled={!(snacks[snack.id] > 0)}
                  >
                    −
                  </button>
                  <span>{snacks[snack.id] || 0}</span>
                  <button
                    type="button"
                    onClick={() => updateSnack(snack.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3>Snacks Total: ₹{snackTotal}</h3>
        </section>
      )}

      {/* PAGE 5: OFFERS */}
      {currentStep === 4 && (
        <section className="info-section">
          <h2>🎁 Offers & Coupons</h2>
          <p>Apply an eligible coupon to save money.</p>

          <div className="offers-grid">
            {offers.map((offer) => (
              <div className="offer-card" key={offer.code}>
                <div className="offer-icon">🎟️</div>
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <p className="offer-detail">{offer.detail}</p>
                <div className="coupon-code">{offer.code}</div>

                <button
                  type="button"
                  className="confirm-btn"
                  onClick={() => {
                    setCoupon(offer.code);
                    applyCoupon(offer.code);
                  }}
                >
                  Apply Offer
                </button>
              </div>
            ))}
          </div>

          <div className="bill-card">
            <label htmlFor="coupon">Enter Coupon Code</label>
            <div className="coupon-input-row">
              <input
                id="coupon"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="MOVIE10 or SNACK50"
              />
              <button
                type="button"
                className="book-btn"
                onClick={() => applyCoupon()}
              >
                Apply
              </button>
            </div>

            {appliedCoupon && (
              <div className="coupon-success">
                <h3>🎉 Coupon Applied Successfully!</h3>
                <p>Applied Coupon: <strong>{appliedCoupon}</strong></p>
                <p>
                  {appliedCoupon === "MOVIE10"
                    ? "10% discount on your movie tickets."
                    : "₹50 discount on eligible snack orders."}
                </p>
                <p>You saved ₹{discount}!</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* PAGE 6: BOOKING SUMMARY */}
      {currentStep === 5 && (
        <section className="info-section bill-section">
          <h2>🧾 Booking Summary</h2>

          <div className="bill-card">
            <p><strong>Movie:</strong> {selectedMovie?.title}</p>
            <p><strong>Theater:</strong> {selectedTheater}</p>
            <p><strong>Date:</strong> {selectedDate}</p>
            <p><strong>Show:</strong> {selectedTime}</p>
            <p><strong>Seats:</strong> {selectedSeats.join(", ")}</p>

            <hr />

            <p>Ticket Total: ₹{ticketTotal}</p>
            <p>Snacks Total: ₹{snackTotal}</p>
            <p>Applied Coupon: {appliedCoupon || "None"}</p>
            <p>Discount: −₹{discount}</p>
            <h2 className="grand-total">Grand Total: ₹{grandTotal}</h2>

            <p className="demo-note">
              Review your booking before continuing to the payment screen.
            </p>
          </div>
        </section>
      )}

      {/* PAGE 7: PAYMENT */}
      {currentStep === 6 && (
        <section className="info-section">
          <div className="payment-box">
            <h2>💳 Choose Payment Method</h2>
            <p>Total to pay: <strong>₹{grandTotal}</strong></p>
            <p>Select a UPI app for this demo.</p>

            <div className="upi-apps">
              {[
                { name: "Google Pay", emoji: "🟢" },
                { name: "PhonePe", emoji: "🟣" },
                { name: "Paytm", emoji: "🔵" },
                { name: "BHIM UPI", emoji: "🇮🇳" },
              ].map((app) => (
                <button
                  type="button"
                  key={app.name}
                  className={paymentApp === app.name ? "active-showtime" : ""}
                  onClick={() => setPaymentApp(app.name)}
                >
                  <span>{app.emoji}</span>
                  {app.name}
                </button>
              ))}
            </div>

            {paymentApp && (
              <p>Selected payment app: <strong>{paymentApp}</strong></p>
            )}

            <p className="demo-note">
              Demo only. No real payment is processed.
            </p>

            <button
              type="button"
              className="confirm-btn"
              onClick={confirmPayment}
            >
              Confirm Demo Booking
            </button>
          </div>
        </section>
      )}

      {/* NEXT AND BACK CONTROLS */}
      <div className="step-navigation">
        <button
          type="button"
          className="book-btn"
          onClick={previousStep}
          disabled={currentStep === 0}
        >
          ← Back
        </button>

        <span>
          Page {currentStep + 1} of {pageNames.length}
        </span>

        {currentStep < 6 && (
          <button
            type="button"
            className="confirm-btn"
            onClick={nextStep}
          >
            {currentStep === 5 ? "Continue to Payment →" : "Next →"}
          </button>
        )}
      </div>

      <footer>
        <h3>🎬 MovieBook</h3>
        <p>Movie Ticket Booking System</p>
        <p>© 2026 MovieBook. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;