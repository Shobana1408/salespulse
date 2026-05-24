CREATE DATABASE IF NOT EXISTS salespulse_db;

USE salespulse_db;

DROP TABLE IF EXISTS sales;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    price FLOAT NOT NULL,
    sale_date DATE NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password) VALUES
('Demo User', 'demo@salespulse.com', '$2b$12$LQv3c1yqBwEHxJv45QXxUOeQnP8JL5z7nK8eZ5z6p2m9s0R7wA1eC');

INSERT INTO sales (product_name, category, quantity, price, sale_date, user_id) VALUES
('Laptop', 'Electronics', 2, 55000, '2026-01-10', 1),
('Mobile Phone', 'Electronics', 5, 18000, '2026-01-18', 1),
('Office Chair', 'Furniture', 3, 4500, '2026-02-05', 1),
('Notebook Set', 'Stationery', 10, 250, '2026-02-15', 1),
('Headphones', 'Electronics', 4, 2200, '2026-03-08', 1),
('Study Table', 'Furniture', 2, 7000, '2026-03-20', 1),
('Pen Pack', 'Stationery', 15, 120, '2026-04-02', 1),
('Keyboard', 'Electronics', 6, 1500, '2026-04-11', 1),
('Mouse', 'Electronics', 8, 700, '2026-05-01', 1),
('Bookshelf', 'Furniture', 1, 9000, '2026-05-12', 1);