# SalesPulse - Full-Stack Sales Analytics App

SalesPulse is a simple full-stack sales analytics web application built using React, FastAPI, and MySQL.

The application helps users register, login, add sales records, view sales analytics, track revenue goals, and download sales reports.

## Tech Stack

### Frontend
- React
- Vite
- CSS
- Recharts
- Axios
- React Router DOM

### Backend
- FastAPI
- Python
- SQLAlchemy
- JWT Authentication
- Passlib
- Bcrypt

### Database
- MySQL

## Features

- User registration
- User login
- JWT-based authentication
- Protected dashboard
- Add sales records
- View sales records
- Delete sales records
- Dashboard analytics
- Total sales, revenue, quantity, and average sale cards
- Monthly revenue chart
- Revenue trend chart
- Category-wise revenue chart
- Monthly sales goal progress bar
- Smart sales insight for best-performing category
- Download sales report as CSV
- Responsive blue-themed user interface

## Project Structure

```txt
salespulse/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── auth.py
│   ├── routes.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── public/
│   │   └── logo.png
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── SalesChart.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Sales.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── styles/
│   │   │   └── style.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── database/
│   └── salespulse.sql
│
├── .gitignore
└── README.md