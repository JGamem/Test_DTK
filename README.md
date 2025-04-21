Detektor Test
A modern full-stack web application for managing vehicles and vehicle groups. This system allows users to create, view, update, and delete vehicles, as well as organize them into custom groups with drag-and-drop functionality.
🚀 Features

Vehicle Management: Add, edit, view, and delete vehicles with their details (brand, model, year, color, location)
Group Organization: Create vehicle groups and manage them with an intuitive drag-and-drop interface
Secure Authentication: JWT-based authentication system with protected routes
Responsive Design: Works seamlessly on desktop and mobile devices
Material Design: Clean, modern UI based on Angular Material components

🔧 Technology Stack
Frontend

Angular 19 - Latest version of the Angular framework
Angular Material - UI component library
RxJS - Reactive programming with observables
TypeScript - Typed superset of JavaScript
Angular CDK - Drag-and-drop functionality

Backend

Node.js - JavaScript runtime
Express - Web application framework
TypeORM - Object-Relational Mapper
PostgreSQL - Relational database
JWT - Authentication with JSON Web Tokens
TypeScript - Type safety for backend code

📋 Prerequisites

Node.js (v22.x or later)
PostgreSQL (v15.x or later)
Angular CLI (v19.x)

🔌 Installation
Clone the repository

git clone https://github.com/yourusername/vehicle-management-system.git
cd vehicle-management-system

Backend Setup

cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env file with your database credentials and JWT secret

# Run database migrations
npm run typeorm migration:run

# Start the server in development mode
npm run dev

Frontend setup

cd frontend
npm install

# Start the development server
npm start

The application will be available at http://localhost:4200 and the API at http://localhost:3000/api/v1.
🚦 API Endpoints
Authentication

POST /api/v1/auth/register - Register a new user
POST /api/v1/auth/login - User login

Vehicles

GET /api/v1/vehicles - List all vehicles
GET /api/v1/vehicles/:id - Get a specific vehicle
POST /api/v1/vehicles - Create a new vehicle
PUT /api/v1/vehicles/:id - Update a vehicle
DELETE /api/v1/vehicles/:id - Delete a vehicle

Groups

GET /api/v1/groups - List all groups
GET /api/v1/groups/:id - Get a specific group
POST /api/v1/groups - Create a new group
POST /api/v1/groups/add-vehicle - Add a vehicle to a group
POST /api/v1/groups/remove-vehicle - Remove a vehicle from a group

🔐 Authentication
The application uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid token which is obtained after logging in. The token must be included in the Authorization header as follows:
Authorization: Bearer [token]
🧪 Testing
bash# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
🚀 Deployment
Backend
bashcd backend
npm run build
npm start
Frontend
bashcd frontend
npm run build
# Deploy the contents of dist/frontend to your web server
📏 Code Style and Standards

ESLint and Prettier for code formatting
Angular style guide best practices
RESTful API design principles

📝 Notes for Developers

The frontend uses standalone components for better tree-shaking
Backend follows a service-repository pattern for clean architecture
API documentation available at /api/v1/docs when the server is running

🤝 Contributing

Fork the repository
Create a feature branch: git checkout -b feature/your-feature-name
Commit your changes: git commit -m 'Add some feature'
Push to the branch: git push origin feature/your-feature-name
Submit a pull request

JGamem - GitHub

🙏 Acknowledgments

Thank you to everyone who contributed to this project
Special thanks to the Angular and Node.js communities for their excellent documentation and tools


This Vehicle Management System was created as part of a technical assessment.