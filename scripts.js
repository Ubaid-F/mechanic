// Pricing data
const prices = {
    'SUV': { 'Minor Repair': 450, 'Major Repair': 1200, 'General Service': 200, 'Health Check': 100, 'MOT': 40 },
    'Minibus': { 'Minor Repair': 550, 'Major Repair': 1500, 'General Service': 350, 'Health Check': 150, 'MOT': 40 },
    'Convertible': { 'Minor Repair': 100, 'Major Repair': 800, 'General Service': 150, 'Health Check': 50, 'MOT': 40 },
    'Other': { 'Minor Repair': 200, 'Major Repair': 1000, 'General Service': 150, 'Health Check': 70, 'MOT': 40 }
};

// Quotation Form Handling
document.addEventListener('DOMContentLoaded', () => {
    const quotationForm = document.getElementById('quotationForm');
    if (quotationForm) {
        quotationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const vehicleType = document.getElementById('vehicle_type').value;
            const serviceType = document.getElementById('service_type').value;
            const motExpiry = document.getElementById('mot_expiry').value;
            const email = document.getElementById('email').value;

            let cost = prices[vehicleType][serviceType];
            if (serviceType === 'MOT' && motExpiry) {
                const today = new Date();
                const expiry = new Date(motExpiry);
                const diffTime = expiry - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays < 7 && diffDays >= 0) {
                    // No surcharge
                } else {
                    cost *= 1.3; // 30% surcharge
                }
            }

            alert(`Quotation for ${vehicleType} (${serviceType}): £${cost} (VAT exclusive)\nSent to: ${email}`);
        });
    }

    // Booking Form Handling
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const vehicleType = document.getElementById('vehicle_type').value;
            const serviceType = document.getElementById('service_type').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const customerName = document.getElementById('customer_name').value;

            // Check if the date is a Saturday
            const day = new Date(date).getDay();
            let cost = prices[vehicleType][serviceType];
            if (day === 6) { // Saturday
                cost *= 1.5; // 50% surcharge
                cost += 50; // Admin fee
            }

            // Check mechanic availability (2 mechanics per slot, 4 total)
            let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            let mechanicsBusy = 0;
            bookings.forEach(booking => {
                if (booking.date === date && booking.time === time) {
                    mechanicsBusy += 2;
                }
            });

            if (mechanicsBusy >= 4) {
                alert('Sorry, this slot is already taken.');
                return;
            }

            // Save the booking
            bookings.push({ date, time, customerName, vehicleType, serviceType, cost });
            localStorage.setItem('bookings', JSON.stringify(bookings));
            alert('Booking successful!');
            bookingForm.reset();
        });
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            alert(`Message from ${name} (${email}):\n${message}\n\nThank you for your message!`);
            contactForm.reset();
        });
    }

    // Admin Login Handling
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        console.log('Admin login form found'); // Debug
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Admin login form submitted'); // Debug
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('adminError');

            if (username === 'admin' && password === 'password123') {
                console.log('Admin login successful, redirecting...'); // Debug
                localStorage.setItem('isAdminLoggedIn', 'true');
                window.location.replace('admin_dashboard.html');
            } else {
                errorElement.textContent = 'Invalid credentials';
            }
        });
    }

    // Admin Dashboard - Display Bookings
    const bookingsTable = document.getElementById('bookingsTable');
    if (bookingsTable) {
        if (localStorage.getItem('isAdminLoggedIn') === 'true') {
            const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            bookings.forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking.date}</td>
                    <td>${booking.time}</td>
                    <td>${booking.customerName}</td>
                    <td>${booking.vehicleType}</td>
                    <td>${booking.serviceType}</td>
                    <td>${booking.cost}</td>
                `;
                bookingsTable.appendChild(row);
            });
        } else {
            window.location.href = 'admin_login.html';
        }
    }

    // Mechanic Login Handling
    const mechanicLoginForm = document.getElementById('mechanicLoginForm');
    if (mechanicLoginForm) {
        console.log('Mechanic login form found'); // Debug
        mechanicLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Mechanic login form submitted'); // Debug
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('mechanicError');

            console.log('Username entered:', username); // Debug
            console.log('Password entered:', password); // Debug

            if (username === 'mechanic' && password === 'mechanic123') {
                console.log('Mechanic login successful, redirecting...'); // Debug
                localStorage.setItem('isMechanicLoggedIn', 'true');
                window.location.replace('mechanic_dashboard.html');
            } else {
                console.log('Mechanic login failed: Invalid credentials'); // Debug
                errorElement.textContent = 'Invalid credentials';
            }
        });
    }

    // Mechanic Dashboard - Display Schedule
    const mechanicScheduleTable = document.getElementById('mechanicScheduleTable');
    if (mechanicScheduleTable) {
        if (localStorage.getItem('isMechanicLoggedIn') === 'true') {
            const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            bookings.forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking.date}</td>
                    <td>${booking.time}</td>
                    <td>${booking.customerName}</td>
                    <td>${booking.vehicleType}</td>
                    <td>${booking.serviceType}</td>
                    <td>${booking.cost}</td>
                `;
                mechanicScheduleTable.appendChild(row);
            });
        } else {
            window.location.href = 'mechanic_login.html';
        }
    }
});