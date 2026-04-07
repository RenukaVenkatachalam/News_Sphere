# NewsSphere 📰

NewsSphere is a modern, full-stack news application built with the MERN stack (MongoDB, Express, React, Node.js). It provides users with a seamless experience to browse, search, and save news articles, while also featuring basic user authentication and profile management.

## 🚀 Features

-   **Live News Feed**: Browse latest news articles with category-based filtering.
-   **Search Functionality**: Quickly find articles by keywords.
-   **Article Details**: Read full articles in a clean, distraction-free interface.
-   **User Authentication**: Secure login and registration system using JWT.
-   **Personalized Experience**:
    -   **Saved Articles**: Save your favorite articles for later reading.
    -   **UserProfile**: Manage your personal information.
-   **Responsive Design**: Fully optimized for mobile, tablet, and desktop screens.
-   **Fake News Detection (BETA)**: Backend infrastructure to identify or report misleading content.

## 🛠️ Tech Stack

**Frontend:**
-   React.js
-   Tailwind CSS (Styling)
-   Lucide React (Icons)
-   React Router DOM (Navigation)
-   Axios (API Requests)

**Backend:**
-   Node.js
-   Express.js
-   MongoDB with Mongoose (Database)
-   JSON Web Tokens (Authentication)
-   Bcrypt.js (Password Encryption)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v16.x or higher)
-   [MongoDB](https://www.mongodb.com/) (Local or Atlas)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## ⚙️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd News_Sphere
    ```

2.  **Environment Variables Setup:**
    Create a `.env` file in the root directory and add the following:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    PORT=5000
    ```

3.  **Install Dependencies:**
    ```bash
    # Install backend dependencies
    cd server
    npm install

    # Install frontend dependencies
    cd ../client
    npm install
    ```

4.  **Run the Application:**
    -   **Start Backend:**
        ```bash
        cd server
        npm start # or nodemon server.js
        ```
    -   **Start Frontend:**
        ```bash
        cd client
        npm start
        ```

## 🏗️ Project Structure

```text
News_Sphere/
├── client/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── core/
│   │   ├── pages/
│   │   └── context/
│   └── public/
├── server/           # Express backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── .env              # Shared configurations
```

## 🌐 Deployment

To deploy this project, remember the build folder mapping:
-   **Backend**: Deploy the `server` folder (Node.js service).
-   **Frontend**: Use `npm run build` in the `client` folder. The **Publish Directory** should be `client/build` (or `build` if your base directory is `client`).

## 📄 License

This project is licensed under the ISC License.
