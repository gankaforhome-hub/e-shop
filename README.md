# 📦 gankaforhome: Project Structure

📦gankaforhome ┣ 📂backend ┃ ┗ .gitkeep  
 ┣ 📂cms ┃ ┗ .gitkeep ┣ 📂frontend ┃ ┗ .gitkeep┃ ┗ 📜README.md

<small> **.gitkeep** - _a placeholder file to keep the folder structure intact
in version control. Keeps the folder in version control even if it's
empty_</small>

### General Workflow

## 📂 **Backend**:

- Handles all server-side logic, user management, and API responses.
- Works with the database to store product details, customer information, and
  order history.
- The backend include technologies such as Node.js, Express, NestJS frameworks,
  with routes for handling product listings, customer information, orders, and
  payments.

## 📂 **CMS**:

- The admin dashboard for managing content such as products, categories,
  customer reviews, and orders.
- Administrators can add new products, update stock levels, or process customer
  orders.
- Built using **Strapi**, a flexible and customizable headless CMS that provides
  easy content management and an API to interact with the frontend.

## 📂 **Frontend**:

- The customer-facing part of the website where users can browse products, add
  them to the cart, and complete purchases.
- Handles responsive design and the presentation of product details, including
  prices, images, and availability.
- Technologies used include React library, NextJS frameworks and different
  library.
