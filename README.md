# Collaborative Project Management Platform

A backend service for a collaborative project management platform inspired by tools like Jira, Trello, and Linear. The application is built using a layered architecture with authentication, organization management, and project management modules.

## Features

### Authentication & Authorization

* User registration and login
* JWT-based authentication
* Access token and refresh token flow
* Refresh token rotation using HTTP-only cookies
* Logout functionality
* Protected routes using authentication middleware
* Ownership-based authorization for resources

### Organization Management

* Create organizations
* View organization details
* List organizations
* Update organizations
* Delete organizations
* Organization ownership model
* Automatic owner membership assignment

### Project Management

* Create projects within organizations
* View project details
* List projects
* Update projects
* Delete projects
* Organization-project relationships
* Ownership-based access control

---

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JWT Access Tokens
* JWT Refresh Tokens
* HTTP-only Cookies

### Architecture

* Controller-Service-Repository Pattern
* REST API Design
* Layered Application Architecture

---

## Project Structure

```text
src
├── config
│   ├── db.js
│   └── env.js
│
├── controllers
│   ├── auth.controller.js
│   ├── organization.controller.js
│   └── project.controller.js
│
├── middlewares
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── notFound.middleware.js
│
├── models
│   ├── user.model.js
│   ├── organization.model.js
│   └── project.model.js
│
├── repositories
│   ├── user.repository.js
│   ├── organization.repository.js
│   └── project.repository.js
│
├── services
│   ├── auth.service.js
│   ├── organization.service.js
│   └── project.service.js
│
├── routes
│   ├── auth.routes.js
│   ├── organization.routes.js
│   ├── project.routes.js
│   └── index.js
│
├── utils
│   ├── ApiError.js
│   ├── ApiResponse.js
│   └── asyncHandler.js
│
├── lib
│   └── jwt.js
│
├── app.js
└── server.js
```

---

## Architecture

The application follows a layered architecture:

```text
Route
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Model
    ↓
MongoDB
```

### Controllers

Responsible for:

* Handling HTTP requests and responses
* Reading request data
* Returning API responses
* Delegating business logic to services

### Services

Responsible for:

* Business logic
* Validation
* Authorization checks
* Application workflows

### Repositories

Responsible for:

* Database interactions
* CRUD operations
* Query abstraction

### Models

Responsible for:

* Schema definitions
* Relationships
* Database constraints

---

## Data Model

### User

```text
User
├── name
├── email
├── password
├── avatar
└── refreshToken
```

### Organization

```text
Organization
├── name
├── description
├── owner
└── members[]
```

### Project

```text
Project
├── name
├── description
├── organization
└── createdBy
```

---

## Resource Hierarchy

```text
Organization
    └── Project
```

Planned hierarchy:

```text
Organization
    └── Project
            └── Board
                    └── Column
                            └── Task
```

---

## API Modules

### Authentication

```http
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
```

### Organizations

```http
POST    /api/v1/organizations
GET     /api/v1/organizations
GET     /api/v1/organizations/:id
PATCH   /api/v1/organizations/:id
DELETE  /api/v1/organizations/:id
```

### Projects

```http
POST    /api/v1/projects
GET     /api/v1/projects
GET     /api/v1/projects/:id
PATCH   /api/v1/projects/:id
DELETE  /api/v1/projects/:id
```

---

## Security

* Password hashing using bcrypt
* JWT authentication
* Refresh token storage
* HTTP-only cookies
* Protected routes
* Resource ownership checks
* Centralized error handling

---

## Future Roadmap

### Core Features

* Boards
* Columns
* Tasks
* Labels
* Due dates
* Attachments
* Comments

### Collaboration

* Organization members
* Invitations
* Roles and permissions
* Task assignment

### Advanced Features

* Activity logs
* Notifications
* Real-time updates using Socket.IO
* File uploads
* Search and filtering
* Analytics dashboard

### Infrastructure

* Docker
* CI/CD Pipeline
* Nginx
* AWS Deployment
* Monitoring and Logging

---

## Learning Objectives

This project is being built to gain practical experience with:

* Backend architecture
* Authentication and authorization
* REST API design
* MongoDB data modeling
* Multi-tenant application design
* Scalable code organization
* Production-oriented development practices
