const bookedDates = {}; // Object to track booked dates for each hotel

// Function to check if a date is available for booking
function isDateAvailable(hotelId, date) {
    return !bookedDates[hotelId]?.includes(date);
}

// Function to open the booking modal
function bookHotel(hotelId, hotelName, hotelPrice) {
    const hotelDetails = `Hotel: ${hotelName}<br>Price per night: $${hotelPrice}`;
    document.getElementById('hotelDetails').innerHTML = hotelDetails;
    $('#bookingModal').modal('show'); // Show the modal

    // Set up the confirm button click handler
    document.getElementById('confirmBooking').onclick = () => confirmBooking(hotelId);
}

// Function to confirm booking
function confirmBooking(hotelId) {
    const startDate = document.getElementById('bookingDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const numAdults = document.getElementById('numAdults').value;
    const numChildren = document.getElementById('numChildren').value;
    const fullName = document.getElementById('fullName').value;
    const creditCard = document.getElementById('creditCard').value;
    function isValidCreditCard(cardNumber) {
        const regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12}|2(?:22|7[0-1]|7[2-9]|7[3-9]|7[4-9]|7[5-9]|7[6-9]|7[7-9]|7[8-9]|7[9-9]|8[0-9]|8[1-9]|8[2-9]|8[3-9]|8[4-9]|8[5-9]|8[6-9]|8[7-9]|8[8-9]|8[9-9]|9[0-9])\d{12})$/;
        return regex.test(cardNumber);
    }
    
    // In the confirmBooking function
    if (!isValidCreditCard(creditCard)) {
        alert('Please enter a valid credit card number.');
        return;
    }
    // Validate inputs
    if (!fullName) {
        alert('Please enter your full name.');
        return;
    }

    if (!creditCard) {
        alert('Please enter your credit card number.');
        return;
    }

    if (!startDate || !returnDate) {
        alert('Please select both start and return dates.');
        return;
    }

    if (!isDateAvailable(hotelId, startDate)) {
        alert('This hotel is already booked on the start date. Please choose another date.');
        return;
    }

    const bookingData = {
        hotelId: hotelId,
        startDate: startDate,
        returnDate: returnDate,
        adults: numAdults,
        children: numChildren,
        fullName: fullName,
        creditCard: creditCard
    };

    fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Booking successful:', data);
        alert('Booking successful!'); // Notify the user

        // Track the booking date
        if (!bookedDates[hotelId]) {
            bookedDates[hotelId] = [];
        }
        bookedDates[hotelId].push(startDate); // Add the booked date

        $('#bookingModal').modal('hide'); // Close the modal
    })
    .catch(error => console.error('Error saving booking data:', error));
}

// Fetch hotels and display them
fetch('http://localhost:3000/hotels')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const hotelContainer = document.getElementById('hotel-container');
        hotelContainer.innerHTML = ''; // Clear existing content

        if (Array.isArray(data)) {
            data.forEach(hotel => {
                const hotelCard = `
                    <div class="col-lg-4">
                        <div class="single-destinations">
                            <div class="thumb">
                                <img src="${hotel.image}" alt="${hotel.name}">
                            </div>
                            <div class="details">
                                <h4 class="d-flex justify-content-between">
                                    <span>${hotel.name}</span>
                                    <div class="star">
                                        ${'<span class="fa fa-star checked"></span>'.repeat(4)}
                                        <span class="fa fa-star"></span>
                                    </div>
                                </h4>
                                <p>View on map | ${hotel.reviews} Reviews</p>
                                <ul class="package-list">
                                    <li class="d-flex justify-content-between align-items-center">
                                        <span>Swimming pool</span>
                                        <span>${hotel.features.swimming_pool ? 'Yes' : 'No'}</span>
                                    </li>
                                    <li class="d-flex justify-content-between align-items-center">
                                        <span>Gymnasium</span>
                                        <span>${hotel.features.gymnasium ? 'Yes' : 'No'}</span>
                                    </li>
                                    <li class="d-flex justify-content-between align-items-center">
                                        <span>Wi-fi</span>
                                        <span>${hotel.features.wi_fi ? 'Yes' : 'No'}</span>
                                    </li>
                                    <li class="d-flex justify-content-between align-items-center">
                                        <span>Room Service</span>
                                        <span>${hotel.features.room_service ? 'Yes' : 'No'}</span>
                                    </li>
                                    <li class="d-flex justify-content-between align-items-center">
                                        <span>Air Condition</span>
                                        <span>${hotel.features.air_condition ? 'Yes' : 'No'}</span>
                                    </li>
                                    <li class="d-flex justify-content-between align-items-center">
                                        <span>Restaurant</span>
                                        <span>${hotel.features.restaurant ? 'Yes' : 'No'}</span>
                                    </li>
                                    <li class="d-flex justify-content-between align-items-center">
                                        <span>Price per night</span>
                                       <span class="price-btn">$${hotel.price_per_night}</span>
                                    </li>
                                    <button onclick="bookHotel(${hotel.id}, '${hotel.name}', ${hotel.price_per_night})" class="btn btn-primary m-auto d-flex">Book Now</button>
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
                hotelContainer.innerHTML += hotelCard; // Append each hotel card to the container
            });
        } else {
            console.error('Data format is incorrect, expected an array of hotels');
        }
    })
    .catch(error => console.error('Error fetching hotel data:', error));

// Optional: Fetch existing bookings to pre-populate bookedDates
fetch('http://localhost:3000/bookings')
    .then(response => response.json())
    .then(data => {
        data.forEach(booking => {
            const { hotelId, startDate } = booking;
            if (!bookedDates[hotelId]) {
                bookedDates[hotelId] = [];
            }
            bookedDates[hotelId].push(startDate); // Populate booked dates
        });
    })
    .catch(error => console.error('Error fetching existing bookings:', error));
