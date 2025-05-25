# 📚 Book Review System

A simple full-stack web application where users can add books and post reviews for them. Built using **Node.js**, **Express**, **Sequelize (MySQL)**, and a **Bootstrap + Axios** frontend.

---

## ✨ Features

- ✅ JWT authentication for User Verification.
- ✅ Add Books with Title, Author, and Publish Year
- ✅ Post one Review per User per Book
- ✅ View Books with Average Ratings and Review Count
- ✅ Pagination Support
- ✅ Search/Filter Books by Title or Author
- ✅ Edit and Delete Reviews
- ✅ Simple Responsive Frontend using Bootstrap

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL (MySQL Workbench), Sequelize ORM
- **Frontend:** HTML, CSS (Bootstrap), JavaScript (Axios)
- **API Format:** REST (JSON responses)

---

## 📦 Project Structure

book-review-system/
│
├── controllers/ # Route Logic (Books, Reviews, Users)
├── middleware/ # Authentication middleware (To be used in Routes for authentication)
├── models/ # Sequelize Models (Book, Review, User)
├── routes/ # Express Routers
├── public/ # Frontend static files (HTML, CSS, JS)
├── util/ # Database Connection
├── app.js # Entry Point (Express app)
└── README.md

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/book-review-system.git
cd book-review-system
```
2. Install Dependencies

```bash
npm install
```

3. Configure Environment Variables -

Create a .env file:

PORT = <Port Number of Your Choice >
DATABASE_NAME = 'jobportal'
DATABASE_USERNAME= 'root'
DATABASE_PASSWORD = '<your_password>'
DATABASE_HOST = 'localhost'
TOKEN_SECRET =  '<Your Token Secret String>'

4. Initialize Database

Make sure MySQL is running. Then run:

```bash
npm run sync   # or use Sequelize CLI migrations if applicable
```

5. Start the App

```bash
npm start
```

The app will run on http://localhost:<Provided Port Number>

🌐 API Endpoints
Users
Method	Endpoint	Description
POST  /api/v1/auth/login  Login Endpoint
POST  /api/v1/auth/signup  Signup Endpoint

Books
Method	Endpoint	Description
GET	/api/v1//book/get-books	List Books (Pagination, Search)
GET	/api/v1//book/get-book/:bookId	Get a Book with its Reviews
POST /api/v1//book/add-book	Add a New Book
POST  /api/v1//book/get-book/:bookId/reviews  Post a Review about the Book

Reviews
Method	Endpoint	Description
PUT	/reviews/:id	Edit an Existing Review
DELETE	/reviews/:id	Delete a Review

## Database Schema

### 👤 `User` Table

| Column       | Type         | Constraints            |
|--------------|--------------|------------------------|
| user_id      | INTEGER      | Primary Key, Auto-Increment|
| username     | STRING(30)   | Not Null, Unique       |
| email        | STRING(100)  | Not Null, Uniquq       |
| password_hash| STRING(255)  | NotNull                |
| createdAt    | DATETIME     | Default (Sequelize)    |
| updatedAt    | DATETIME     | Default (Sequelize)    |

### 📘 `Book` Table

| Column       | Type         | Constraints            |
|--------------|--------------|------------------------|
| book_id      | INTEGER      | Primary Key, Auto-Increment |
| user_id      | INTEGER      | Foreign Key → User(user_id), Not Null |
| title        | STRING(255)  | Not Null               |
| author       | STRING(255)  | Not Null               |
| publish_year | STRING(255)  | Optional               |
| createdAt    | DATETIME     | Default (Sequelize)    |
| updatedAt    | DATETIME     | Default (Sequelize)    |


### ✍️ `Review` Table

| Column       | Type     | Constraints                        |
|--------------|----------|------------------------------------|
| review_id    | INTEGER  | Primary Key, Auto-Increment        |
| book_id      | INTEGER  | Foreign Key → Book(book_id), Not Null |
| user_id      | INTEGER  | Foreign Key → User(user_id), Not Null |
| rating       | INTEGER  | Not Null, 1–5                      |
| review_text  | TEXT     | Optional                           |
| createdAt    | DATETIME | Default (Sequelize)                |
| updatedAt    | DATETIME | Default (Sequelize)                |
