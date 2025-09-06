# Full-Stack Store Rating Application

This is a complete web application that allows users to submit and view ratings for stores registered on the platform. It features a robust, role-based access control system for three types of users: System Administrator, Store Owner, and Normal User.

## Live Demo & Project Walkthrough

You can view a complete video demonstration of the project, showcasing all features for the Admin, Store Owner, and Normal User roles by following the link below.

**[View Project Demo Video](https://drive.google.com/file/d/1FNqRrkInc-J5Th52DCvwksMxsA9r0Bdp/view?usp=sharing)**

## Tech Stack
- **Backend:** Node.js with Express.js
- **Frontend:** React.js (built with Vite)
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)

---

## Features

### System Administrator
- Dashboard with key statistics (total users, stores, ratings).
- Create new users (Admins, Store Owners, Normal Users) directly from the GUI.
- Create new stores and assign them to owners directly from the GUI.
- View sortable and filterable lists of all users and stores.
- View the average rating of a store owned by a "Store Owner" user.

### Normal User
- Secure sign-up and login.
- View a visually appealing, searchable grid of all stores.
- Click on a store to view a detailed page with its description and ratings.
- Submit and modify their own 1-5 star rating for any store.
- Change their own password.

### Store Owner
- Secure login.
- View a dedicated dashboard for their own store.
- See their store's current average rating.
- View a list of all users who have submitted a rating for their store.
- Change their own password.

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v20.x or higher recommended)
- PostgreSQL
- Git

### Installation & Setup

1.  **Clone the repository to your local machine:**
    ```bash
    git clone https://github.com/YourUsername/store-rating-app.git
    cd store-rating-app
    ```

2.  **Setup the Backend:**
    - Navigate to the backend directory: `cd backend`
    - Install the required dependencies: `npm install`
    - **Crucial:** Create a `.env` file in the `backend` directory. Copy the contents of `.env.example` (or the block below) and fill in your PostgreSQL database credentials.
    - Start the backend server: `npm run dev` (It will run on `http://localhost:5000`)

3.  **Setup the Frontend:**
    - Open a **new terminal** and navigate to the frontend directory: `cd frontend`
    - Install the required dependencies: `npm install`
    - Start the frontend development server: `npm run dev` (It will run on `http://localhost:5173`)

### Backend `.env` Configuration

You must create a `.env` file in the `/backend` directory with the following variables:
PostgreSQL Database Configuration
DB_USER=your_postgres_username
DB_HOST=localhost
DB_DATABASE=your_database_name
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT Configuration
JWT_SECRET=this-is-a-super-secret-key-you-should-change
JWT_EXPIRES_IN=1h


---

## Sample User Credentials

After a fresh database setup, you can use the GUI to create the following users for a complete demonstration of the application's features.

### System Administrator
- **Email:** `admin@final.com`
- **Password:** `Admin@01`
- **Note:** The first admin must be created via the signup form and then manually promoted in the database. See the project documentation for details.

### Store Owners
1.  **Aishwarya Venkataraman**
    - **Email:** `owner.aishwarya@example.com`
    - **Password:** `OwnerPass1!`
2.  **Siddharth Mukhopadhyay**
    - **Email:** `owner.siddharth@example.com `
    - **Password:** `OwnerPass2!`
3.  **Priyamvada Deshpande**
    - **Email:** `owner.priyamvada@example.com`
    - **Password:** `OwnerPass3!`

### Normal Users
1.  **Krishnamurthy Subramanian**
    - **Email:** `user.krishnamurthy@example.com`
    - **Password:** `UserPass1!`
2.  **Ananyalakshmi Chatterjee**
    - **Email:** `user.ananyalakshmi@example.com`
    - **Password:** `UserPass2!`
3.  **Padmanabhan Bhattacharya**
    - **Email:** `user.padmanabhan@example.com`
    - **Password:** `UserPass3!`
---