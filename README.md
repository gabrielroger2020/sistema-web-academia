# BMI Tracking System - Sooro by the Whey Test

This is a Full Stack project developed as part of a technical test for a Full Stack Developer position. The web system was created for a gym that needs to track the Body Mass Index (BMI) evolution of its students, allowing the registration of users (administrators, professors, and students) and their evaluations.

## Main Features

  - **User Registration**: The system allows user registration with three distinct profiles: Administrator, Professor, and Student.
  - **JWT Authentication**: A complete authentication flow with username and password, using JSON Web Token (JWT) to protect the API routes.
  - **User Management (Admin)**:
      - Administrators can create, edit, and delete other users.
      - Allows activating or deactivating users, controlling their access to the system.
  - **BMI Evaluation Management**:
      - Professors and Administrators can register, edit, and delete BMI evaluations for students.
      - The BMI and its classification are calculated and stored automatically based on the provided height and weight.
  - **Permission System (Business Rules)**:
      - **Administrator**: Full access to the system, able to view and manage all data.
      - **Professor**: Manages only the students and evaluations they have created.
      - **Student**: Read-only access to their own evaluations.
  - **Query Filters**: The evaluations screen allows filtering by student or professor.

## Technologies Used

The project was built following a monorepo structure, with version control adhering to the Conventional Commits standard.

### Backend

  - **TypeScript**
  - **Node.js** with **Express.js**
  - **TypeORM** for the ORM and Migrations management
  - **SQLite** as the database
  - **Zod** for data validation on endpoints
  - **JSON Web Token (JWT)** for authentication
  - **CORS** to allow communication with the frontend

### Frontend

  - **TypeScript**
  - **React** with **Next.js**
  - **Chakra UI** for the component library
  - **TanStack Query (React Query)** for asynchronous state management and caching
  - **React Hook Form** for building forms
  - **Zod** for form schema validation
  - **Axios** for API requests

## How to Run the Project

### Prerequisites

  - Node.js (v18 or higher)
  - NPM or Yarn

### 1\. Backend

First, set up and run the backend server.

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Run the Migrations
# (See the section below for more details)
npm run typeorm -- -d src/shared/infra/typeorm/index.ts migration:run

# 4. Start the server in development mode
npm run dev

# The server will be running at http://localhost:3333
```

### 2\. Frontend

In a new terminal, set up and run the frontend application.

```bash
# 1. Navigate to the frontend folder
cd web

# 2. Install dependencies
npm install

# 3. Start the application
npm run dev

# The application will be available at http://localhost:3000
```

## Database and Migrations

The project uses **SQLite**, so no additional database server configuration is required. The `database.sqlite` file will be created automatically in the root of the `backend` folder the first time the migrations are run.

  - **Where are the migrations located?**
    The TypeORM migration files, which define the database structure, are located at:
    `backend/src/shared/infra/typeorm/migrations`

  - **How to run the migrations?**
    To create the tables and populate the database with initial data, execute the following command in the `backend` folder:

    ```bash
    npm run typeorm -- -d src/shared/infra/typeorm/index.ts migration:run
    ```

## Initial Access Credentials

The system's first migration automatically creates an **Administrator** user to allow initial access to the system.

  - **Username**: `admin`
  - **Password**: `admin123`