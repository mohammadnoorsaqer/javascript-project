// 1. Booked Dates Object & Fetching Booked Dates
const bookedDates = {};

fetch('http://localhost:3000/bookings')
    .then(response => response.json())
    .then(data => {
        data.forEach(booking => {
            bookedDates[booking.hotelId] = bookedDates[booking.hotelId] || [];
            bookedDates[booking.hotelId].push(booking.startDate);
        });
    });

// 2. Checking Date Availability
function isDateAvailable(hotelId, date) {
    return !bookedDates[hotelId]?.includes(date);
}

// 3. Fetching Hotels and Displaying Them
fetch('http://localhost:3000/hotels')
    .then(response => response.json())
    .then(data => {
        data.forEach(hotel => {
            const hotelCard = `
                <div class="col-lg-4">
                    <div class="single-destinations">
                        <div class="thumb">
                            <img src="${hotel.image}" alt="${hotel.name}">
                        </div>
                        <div class="details">
                            <h4>${hotel.name}</h4>
                            <p>${hotel.reviews} Reviews</p>
             
                                                    <button onclick="bookHotel(${hotel.id}, '${hotel.name}', ${hotel.price_per_night})" class="btn yellow-btn m-auto d-flex">Book Now</button>
                        </div>
                    </div>
                </div>`;
            document.getElementById('hotel-container').innerHTML += hotelCard;
        });
    });
const hotelBookings = {};
// 4. Booking Modal & Confirmation Functions
function bookHotel(hotelId, hotelName, hotelPrice) {
    const hotelDetails = `Hotel: ${hotelName}<br>Price per night: ${hotelPrice}`;
    document.getElementById('hotelDetails').innerHTML = hotelDetails;
    $('#bookingModal').modal('show');
    document.getElementById('confirmBooking').onclick = () => confirmBooking(hotelId);
}
function confirmBooking(hotelId) {
    const startDate = document.getElementById('bookingDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const numAdults = document.getElementById('numAdults').value;
    const numChildren = document.getElementById('numChildren').value;
    const fullName = document.getElementById('fullName').value;
    const creditCard = document.getElementById('creditCard').value;

    // Credit card validation function
    function isValidCreditCard(cardNumber) {
        const regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12}|2(?:22|7[0-9]|8[0-9])\d{12})$/;
        return regex.test(cardNumber);
    }

    // Validate credit card number
    if (!isValidCreditCard(creditCard)) {
        alert('Please enter a valid credit card number.');
        return;
    }

    // Check if all fields are filled
    if (!fullName || !creditCard || !startDate || !returnDate) {
        alert('Please fill out all required fields.');
        return;
    }
if(startDate>=returnDate)
{
    return alert('please choose a valid date.')
}
    // Check if the hotel is available on the start date
    if (!isDateAvailable(hotelId, startDate)) {
        alert('This Room Is Booked in this day ,please choose another day');
        return;
    }
        // Check if the hotel has reached the maximum number of bookings
        if (!hotelBookings[hotelId]) {
            hotelBookings[hotelId] = 0; // Initialize if it doesn't exist
        }
    
        if (hotelBookings[hotelId] >= 10) {
            alert('This hotel is fully booked. Please look for other hotels.');
            return;
        }
     

    // Prepare booking data
    const bookingData = {
        hotelId, startDate, returnDate, numAdults, numChildren, fullName, creditCard
    };
    hotelBookings[hotelId]++;    

    // Send booking data to the server
    fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Booking confirmed! Enjoy your stay!');
        bookedDates[hotelId] = bookedDates[hotelId] || [];
        bookedDates[hotelId].push(startDate);
        $('#bookingModal').modal('hide');
    })
    .catch(error => console.error('Error:', error));
}
window.onload = () => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Set the min attribute to today's date
    document.getElementById('bookingDate').setAttribute('min', today);
    document.getElementById('returnDate').setAttribute('min', today);
}