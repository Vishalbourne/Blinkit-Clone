﻿# 🛒 Blinkit Clone – Grocery Delivery Backend (EJS)

This is a **backend clone** of Blinkit, focused on essential features like user authentication, product management, cart functionality, order placement, and Razorpay payments. The UI is built using **EJS (Embedded JavaScript templates)** for server-side rendering.

---

## 🚀 Features

* 👤 **User Registration & Login** with **JWT + Bcrypt**
* 🔒 **Google OAuth** integration using Passport.js
* 📦 **Product & Category CRUD** (Admin)
* 🛒 **Cart Management**
* ✅ **Order Placement & Checkout**
* 💳 **Razorpay Payment Integration**
* 📄 **EJS-based Frontend Views**
* 📁 **File Uploads** (e.g., product images) using Multer
* 📚 **Input Validation** with Joi
* 🛡️ **Secure Session Handling**

---

## 🧰 Tech Stack

| Technology | Description                    |
| ---------- | ------------------------------ |
| Node.js    | Runtime environment            |
| Express.js | Backend framework              |
| MongoDB    | NoSQL database (with Mongoose) |
| EJS        | Templating engine for views    |

---

## 📦 Dependencies

```json
"bcrypt" – Hashes passwords securely  
"cookie-parser" – Parses cookies for auth/session  
"dotenv" – Loads environment variables from `.env`  
"ejs" – For rendering dynamic HTML pages  
"express" – Web framework  
"express-session" – Stores session data  
"joi" – Validates user input  
"jsonwebtoken" – Handles authentication with JWT  
"mongoose" – Connects and models MongoDB  
"multer" – Uploads files (images/docs)  
"passport" – Manages authentication strategies  
"passport-google-oauth20" – Google login integration  
"razorpay" – Payment gateway integration
```

---

## 📂 Project Structure

```
├── controllers/        → Route logic (business logic for routes)
├── models/             → Mongoose schemas (database models)
├── routes/             → All route handlers (defines API endpoints)
├── views/              → EJS frontend templates
├── public/             → Static files (CSS, JS, images)
│   └── screenshots/    → Project screenshots
├── assets/             → Images for README and docs
│   └── logo.png        → Project logo
├── .env                → Environment variables (ignored by Git)
├── server.js / app.js  → Entry point of the application
├── package.json        → Project metadata and dependencies
└── README.md           → This documentation file
```

---

## 🚀 Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Vishalbourne/Blinkit-Clone.git
   cd Blinkit-Clone
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root of the project directory. Copy the example below and replace the placeholder values with your actual credentials.

   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_KEY=your_very_strong_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

---

## 📷  Screenshots


![Screenshot 2025-05-10 204040](https://github.com/user-attachments/assets/3b6ac7dc-5c36-480f-9569-97f405324f28)
![Screenshot 2025-05-10 204111](https://github.com/user-attachments/assets/76ac7ec9-50f7-41fb-b42d-2f224db6871e)
![Screenshot 2025-05-10 204242](https://github.com/user-attachments/assets/1b8fca22-cbda-4f02-a69c-1be5694c46e4)
![Screenshot 2025-05-10 204310](https://github.com/user-attachments/assets/0f7a4451-3e3a-4e83-9a5f-e3e8d6a5fab7)
![Screenshot 2025-05-10 204337](https://github.com/user-attachments/assets/cb477be2-6a8a-4657-b465-5a3f1511ab4d)


