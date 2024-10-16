# Webstack - Portfolio Project

## Trendify Ecommerce 🛒

Trendify Ecommerce is a full-stack web application designed for a seamless shopping experience. The project features an admin dashboard, sales analytics, and a secure payment gateway. It integrates a robust authentication system using JWT tokens with access and refresh tokens, along with MongoDB and Redis for efficient data management.

## Technologies

### Frontend

- **React.js**: For building a dynamic, single-page application.
- **Tailwind CSS**: For responsive and modern UI styling.

### Backend

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for building the REST API.

### Database

- **MongoDB**: NoSQL database for storing user, product, and transaction data.

### Caching

- **Redis**: For session management, caching frequently accessed data, and enhancing performance.

### Payment Gateway

- **Stripe**: For handling secure payments.

### Authentication

- **JWT (JSON Web Tokens)**: Secures the authentication process using access and refresh tokens.

## Features

### 1. MongoDB & Redis Integration

- MongoDB stores product and user data, while Redis is used for caching and session storage, ensuring efficient data retrieval and reducing server load.

### 2. Shopping Cart Functionality

- Users can add/remove items to their cart, update quantities, and proceed to checkout.
- Cart state is preserved across sessions using Redis.

### 3. Stripe Payment Setup

- Secure payment processing with Stripe, ensuring that users can make transactions smoothly.

### 4. Admin Dashboard

- Admins can monitor sales, view detailed analytics, manage products, and process orders.
- Admin dashboard is secured with role-based access control.

### 5. Sales Analytics

- Visual insights into sales performance, customer behavior, and product popularity.

### 6. Security

- Passwords are hashed before storage using bcrypt.
- JWT-based authentication system with both access and refresh tokens.
- Implemented proper CORS policies and HTTPS for secure data transmission.

### 7. User Signup & Login

- Users can register and log in with email and password.
- Session management is handled with refresh tokens for extended login sessions.

### 8. Robust Authentication System

- Utilizes JWT tokens for stateless authentication.
- Access tokens have a short lifespan, while refresh tokens can be used to generate new access tokens.

## Installation

### Prerequisites

- Node.js
- MongoDB (either installed locally or using MongoDB Atlas)
- Redis
- Stripe Account
- Cloudinary account

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Joeeazy/Trendify_Place.git
   cd Trendify_Place
   ```

2. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables:**

   Create a `.env` file in the root directory with the following keys:

   ```env

   PORT=5000

   MONGO_URI=your_mongo_uri

   UPSTASH_REDIS_URL=your_redis_url

   ACCESS_TOKEN_SECRET=your_access_token_secret

   REFRESH_TOKEN_SECRET=your_refresh_token_secret

   CLOUDINARY_CLOUD_NAME=your_cloud_name

   CLOUDINARY_API_KEY=your_api_key

   CLOUDINARY_API_SECRET=your_api_secret

   STRIPE_SECRET_KEY=your_stripe_secret_key

   CLIENT_URL=http://localhost:5173

   NODE_ENV=development

   ```

5. **Run the application:**

   - Run app Locally:

     ```bash
     npm run build
     ```

   - To start the app:
     ```bash
     npm run start
     ```
