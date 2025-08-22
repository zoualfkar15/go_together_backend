# GoTogether Backend

## Overview
GoTogether is a ride-sharing platform that connects users looking for rides with drivers offering them. This backend project is built using Node.js, Express, Sequelize, and MySQL.

## Features
- User registration and authentication
- Ride creation and management
- Booking rides
- Admin functionalities for managing users and rides

## Technologies Used
- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JSON Web Tokens (JWT) for authentication

## Project Structure
```
go-together-backend
├── src
│   ├── app.js
│   ├── config
│   │   └── database.js
│   ├── models
│   │   ├── user.js
│   │   ├── ride.js
│   │   ├── booking.js
│   │   └── admin.js
│   ├── services
│   │   ├── userService.js
│   │   ├── rideService.js
│   │   ├── bookingService.js
│   │   └── adminService.js
│   ├── controllers
│   │   ├── userController.js
│   │   ├── rideController.js
│   │   ├── bookingController.js
│   │   └── adminController.js
│   ├── routes
│   │   ├── userRoutes.js
│   │   ├── rideRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── adminRoutes.js
│   └── middleware
│       └── auth.js
├── package.json
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd go-together-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the MySQL database:
   - Create a new database for the project.
   - Update the database configuration in `src/config/database.js`.

4. Run the application:
   ```
   npm start
   ```

## API Usage
- **User Endpoints**
  - Register: `POST /api/users/register`
  - Login: `POST /api/users/login`
  - Get User Details: `GET /api/users/:id`

- **Ride Endpoints**
  - Create Ride: `POST /api/rides`
  - Get Rides: `GET /api/rides`
  - Update Ride: `PUT /api/rides/:id`

- **Booking Endpoints**
  - Create Booking: `POST /api/bookings`
  - Get Bookings: `GET /api/bookings`
  - Update Booking Status: `PUT /api/bookings/:id`

- **Admin Endpoints**
  - Manage Users: `GET /api/admin/users`
  - Manage Rides: `GET /api/admin/rides`

## License
This project is licensed under the MIT License.