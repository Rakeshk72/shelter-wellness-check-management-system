# Shelter Wellness Check Management System

## Capstone Project

The Shelter Wellness Check Management System is a full-stack MERN application designed to help shelter staff record, manage, and review resident wellness checks.

The application provides a centralized system for tracking resident wellness information instead of relying only on manual or paper-based records.

---

## Project Objective

The objective of this project is to build a full-stack web application using the MERN stack:

- MongoDB
- Express.js
- React
- Node.js

The application demonstrates full-stack development concepts including RESTful APIs, CRUD operations, database management, authentication, React Router navigation, React Hooks, API communication, and responsive user interface design.

---

## Features

- Staff authentication and login
- JWT-based authentication
- Protected application routes
- Logout functionality
- Multi-page navigation using React Router
- Dashboard summary
- Add and manage residents
- View resident information
- Update resident information
- Delete resident records
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
- View total residents and wellness check totals
- View Present, Absent, and Partial totals
- View the latest wellness check
- Store application data in MongoDB

---

## Application Views

The application includes multiple views that can be accessed through React Router navigation:

- **Staff Login** - Allows authorized staff to sign in
- **Dashboard** - Displays resident and wellness check summary information
- **Daily Check** - Provides a daily wellness check sheet for residents
- **Record Check** - Allows staff to record an individual wellness check
- **History** - Displays and filters previously recorded wellness checks
- **Residents** - Allows staff to add, view, update, and delete resident records

---

## Technologies Used

### Frontend

- React
- React Router DOM
- JavaScript ES6+
- HTML5
- CSS3
- Vite
- Fetch API
- React Hooks

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Token (JWT)
- CORS
- dotenv

### Development Tools

- Visual Studio Code
- Git
- GitHub
- MongoDB Atlas
- Thunder Client
- npm

---

## Project Structure

The project is organized into separate backend and frontend applications.

```text
shelter-wellness-check-management-system/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── Resident.js
│   │   └── WellnessCheck.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── residentRoutes.js
│   │   └── wellnessCheckRoutes.js
│   ├── seed/
│   │   └── seedResidents.js
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── DailyWellnessSheet.jsx
│   │   │   ├── ResidentForm.jsx
│   │   │   ├── ResidentList.jsx
│   │   │   ├── WellnessCheckForm.jsx
│   │   │   └── WellnessCheckList.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## RESTful API

The backend provides a RESTful API using Node.js, Express.js, MongoDB, and Mongoose.

### Authentication

- `POST /api/auth/login` - Authenticate shelter staff and return a JWT token

### Residents

- `GET /api/residents` - Retrieve all residents
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

---

## CRUD Operations

The application demonstrates all four CRUD operations:

- **Create** - Add residents and record wellness checks
- **Read** - View residents and wellness check history
- **Update** - Edit resident and wellness check information
- **Delete** - Remove resident and wellness check records

---

## Authentication

The application includes staff authentication to restrict access to shelter wellness information.

The backend verifies staff login information and uses JSON Web Tokens (JWT) for authentication.

Passwords are handled using `bcryptjs`.

After successful authentication, staff can access the application's protected views.

The application also provides logout functionality.

No passwords, database credentials, or JWT secrets are stored in this README.

---

## React Router Navigation

React Router is used to provide navigation between application views.

The application includes routes for:

```text
/
 /daily
 /record
 /history
 /residents
 /login
```

Unknown routes are redirected to the appropriate application page.

---

## React State Management

The application uses React Hooks for state management, including:

- `useState`
- `useEffect`
- `useNavigate`

These hooks are used to manage form data, API data, authentication state, dashboard information, filtering, and navigation.

---

## Database

MongoDB is used as the application's database.

Mongoose is used to:

- Define schemas
- Validate application data
- Create models
- Query MongoDB
- Create and update documents
- Delete documents
- Populate related resident information

The application includes models for:

- Residents
- Wellness Checks

Appropriate schema validation and database indexing are used where needed.

---

## Error Handling

The application uses error handling on both the frontend and backend.

Backend API operations use `try/catch` blocks and appropriate HTTP status responses.

Frontend API requests check server responses and display messages when operations cannot be completed.

---

## Running the Project Locally

### Requirements

Before running the application, install:

- Node.js
- npm
- MongoDB Atlas account or MongoDB database

---

### Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install backend dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory.

The required environment variables include:

```text
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

Do not commit the real `.env` file or secret values to GitHub.

Start the backend development server:

```bash
npm run dev
```

The backend runs locally on port `5000` unless another port is configured.

---

### Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Vite will display the local development address in the terminal.

---

## Security

Sensitive environment information is stored in the backend `.env` file.

The `.env` file is excluded from Git tracking using `.gitignore`.

Database credentials, authentication secrets, and passwords should never be committed to the GitHub repository.

---

## Application Workflow

1. Staff opens the application.
2. Staff signs in through the Staff Login page.
3. After successful authentication, staff is directed to the application.
4. The Dashboard displays current resident and wellness check information.
5. Staff can use Daily Check to complete wellness rounds.
6. Staff can record individual wellness checks.
7. Staff can review and filter wellness check history.
8. Staff can add, update, view, and delete resident information.
9. Staff can log out when finished.

---

## Purpose and Use Case

Shelter staff may need to complete wellness checks for many residents during different shifts and scheduled rounds.

This application provides a digital workflow for organizing those checks and allows staff to quickly review wellness information, resident status, check history, and staff documentation.

The project demonstrates how a MERN application can be designed around a practical operational workflow.

---

## Future Improvements

Possible future improvements include:

- Multiple staff user accounts
- Administrator and staff roles
- Stronger role-based authorization
- Secure database-backed user accounts
- Password reset functionality
- Reporting and analytics
- Export wellness reports
- Additional dashboard statistics
- Mobile optimization
- Deployment to a public hosting service
- Additional security controls for production use

---

## Capstone Requirements Demonstrated

This project demonstrates:

- Full-stack MERN development
- MongoDB database integration
- Mongoose schemas and models
- Node.js and Express.js backend
- RESTful API design
- Four CRUD operations
- Authentication
- React frontend development
- React Router navigation
- React Hooks
- Fetch API requests
- ES6+ JavaScript
- CSS styling
- Error handling
- Organized project structure
- Git and GitHub version control
- Application documentation

---

## Author

Rakesh Kumar

Software Engineering Capstone Project