# Shelter Wellness Check Management System

## Capstone Project

The Shelter Wellness Check Management System is a full-stack MERN application designed to help shelter staff record, manage, and review resident wellness checks.

The application provides a centralized system for tracking resident wellness information instead of relying only on manual or paper-based records.

## Project Objective

The objective of this project is to build a full-stack web application using the MERN stack:

- MongoDB
- Express.js
- React
- Node.js

## Features

- Add and manage residents
- View resident information
- Record individual wellness checks
- Complete daily wellness checks for assigned residents
- Track Present, Absent, and Partial wellness statuses
- Track adults and children present
- Record NSR presence
- Record staff name and comments
- Select wellness check rounds
- Prevent duplicate scheduled wellness checks
- Search residents by unit number or resident name
- Filter wellness check history
- Filter history by date
- Filter history by check round
- Filter history by staff name
- View wellness check history
- Update wellness check records
- Delete wellness check records
- View dashboard summary information
- View total residents and wellness check totals
- View Present, Absent, and Partial totals
- View the latest wellness check
- Store application data in MongoDB

## Technologies Used

### Frontend

- React
- JavaScript
- HTML
- CSS
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- dotenv

## Project Structure

The project is divided into two main applications:

- `backend` - Node.js, Express, MongoDB, and Mongoose
- `frontend` - React user interface

## API Endpoints

### Residents

- `GET /api/residents` - Retrieve residents
- `POST /api/residents` - Create a resident
- `GET /api/residents/:id` - Retrieve one resident
- `PUT /api/residents/:id` - Update a resident
- `DELETE /api/residents/:id` - Delete a resident

### Wellness Checks

- `GET /api/wellness-checks` - Retrieve wellness checks
- `POST /api/wellness-checks` - Create a wellness check
- `GET /api/wellness-checks/:id` - Retrieve one wellness check
- `PUT /api/wellness-checks/:id` - Update a wellness check
- `DELETE /api/wellness-checks/:id` - Delete a wellness check

## Running the Project

### Backend

Navigate to the backend folder:

```bash
cd backend