document.addEventListener('DOMContentLoaded', function () {
    const sourceInput = document.getElementById('source');
    const destinationInput = document.getElementById('destination');
    const resultsContainer = document.getElementById('results-container');
    const resultsHeading = document.getElementById('results-heading');
    const graphqlBtn = document.getElementById('graphql-btn');
    const restBtn = document.getElementById('rest-btn');

    graphqlBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const source = sourceInput.value;
        const destination = destinationInput.value;

        const startTime = performance.now();

        const query = `query { flights(source: "${source}", destination: "${destination}") { sAirport sCity sCountry dAirport dCity dCountry airline } hotels(destination: "${destination}") {name, city} activities(destination: "${destination}") {activityName, city}}`;

        // Make an AJAX request to your GraphQL API
        fetch('http://localhost:5163/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query }),
        })
            .then(response => response.json())
            .then(data => {
                // Capture the end time
                const endTime = performance.now();

                // Calculate the time taken
                const timeTaken = (endTime - startTime).toFixed(2);

                // Update the heading with time taken
                resultsHeading.textContent = `Search completed in ${timeTaken} ms`;

                const flightsResults = document.getElementById('flights-results');
                const hotelsResults = document.getElementById('hotels-results');
                const activitiesResults = document.getElementById('activities-results');

                // Handle the API response and populate the sections
                flightsResults.innerHTML = buildFlightResults(data.data.flights);
                hotelsResults.innerHTML = buildHotelResults(data.data.hotels);
                activitiesResults.innerHTML = buildActivityResults(data.data.activities);

                // Display the results container
                resultsContainer.style.display = 'block';
            })
            .catch(error => {
                console.error(error);
            });
    });

    restBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const source = sourceInput.value;
        const destination = destinationInput.value;

        const startTime = performance.now();

        fetch(`https://localhost:7150/Travel/GetFlights?source=${source}&destination=${destination}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                const flightsResults = document.getElementById('flights-results');
                // Handle the API response and populate the sections
                flightsResults.innerHTML = buildFlightResults(data);

                // Display the results container
                resultsContainer.style.display = 'block';
            })
            .catch(error => {
                console.error(error);
            });

        fetch(`https://localhost:7150/Travel/GetHotels?destination=${destination}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                const hotelsResults = document.getElementById('hotels-results');
                // Handle the API response and populate the sections
                hotelsResults.innerHTML = buildHotelResults(data);

                // Display the results container
                resultsContainer.style.display = 'block';
            })
            .catch(error => {
                console.error(error);
            });

        fetch(`https://localhost:7150/Travel/GetActivities?destination=${destination}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                // Capture the end time
                const endTime = performance.now();

                // Calculate the time taken
                const timeTaken = (endTime - startTime).toFixed(2);

                // Update the heading with time taken
                resultsHeading.textContent = `Search completed in ${timeTaken} ms`;

                const activitiesResults = document.getElementById('activities-results');
                // Handle the API response and populate the sections
                activitiesResults.innerHTML = buildActivityResults(data);

                // Display the results container
                resultsContainer.style.display = 'block';
            })
            .catch(error => {
                console.error(error);
            });
    });

    function buildFlightResults(flights) {
        if (!flights || flights.length === 0) {
            return '<p>No flight results available.</p>';
        }

        const flightList = flights.map(flight => `
            <div class="flight-card">
                <h4 class="airline">${flight.airline}</h4>
                <div class="flight-details">
                    <div class="flight-location">
                        <span class="city">${flight.sCity}</span>
                        <span class="country">${flight.sCountry}</span>
                    </div>
                    <div class="flight-location">
                        <span class="city">${flight.dCity}</span>
                        <span class="country">${flight.dCountry}</span>
                    </div>
                </div>
            </div>
        `).join('');

        return flightList;
    }

    function buildHotelResults(hotels) {
        if (!hotels || hotels.length === 0) {
            return '<p>No hotel results available.</p>';
        }

        const hotelList = hotels.map(hotel => `
            <div class="flight-card">
                <h4 class="airline">${hotel.name}</h4>
                <div class="flight-details">
                    <div class="flight-location">
                        <span class="city">${hotel.city}</span>
                    </div>
                </div>
            </div>
        `).join('');

        return hotelList;
    }

    function buildActivityResults(activities) {
        if (!activities || activities.length === 0) {
            return '<p>No activity results available.</p>';
        }

        const activityList = activities.map(activity => `
            <div class="flight-card">
                <h4 class="airline">${activity.activityName}</h4>
                <div class="flight-details">
                    <div class="flight-location">
                        <span class="city">${activity.city}</span>
                    </div>
                </div>
            </div>
        `).join('');

        return activityList;
    }

    // Add event listeners for each collapsible heading
    document.getElementById('flights-heading').addEventListener('click', () => {
        toggleSection('flights-results');
        toggleArrowIcon('flights-heading');
    });

    document.getElementById('hotels-heading').addEventListener('click', () => {
        toggleSection('hotels-results');
        toggleArrowIcon('hotels-heading');
    });

    document.getElementById('activities-heading').addEventListener('click', () => {
        toggleSection('activities-results');
        toggleArrowIcon('activities-heading');
    });

    function toggleSection(sectionId) {
        const section = document.getElementById(sectionId);
        section.style.display = section.style.display === 'none' ? 'block' : 'none';
    }

    function toggleArrowIcon(headingId) {
        const heading = document.getElementById(headingId);
        heading.classList.toggle('collapsed');
    }

});
