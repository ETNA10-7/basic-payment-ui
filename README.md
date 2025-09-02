
## Basic Payment-UI

A full-stack **payment management system** built with **React.js, Node.js (Express), MongoDB, and Tailwind CSS**.
The app allows users to securely manage accounts, transfer money, and view transaction details.



🚀 **Features**

🔐 **User Authentication**: Secure login, signup, and logout using **JWT**.

💸 **Send & Receive Money**: Users can transfer money to other users.
💰 **Account Balance Management**: View current balance and add funds.
📊 **Dashboard with Filtering**: Search and filter recipients by name keywords before initiating transfers.
⚡ **RESTful APIs**: Node.js backend provides endpoints for authentication, balance management, and transactions.
🗄 **Database Transactions (ACID)**: Ensures reliable and consistent financial operations using MongoDB transactions.
🎨 **Modern UI**: Built with React.js and styled using Tailwind CSS, with React Hooks (`useState`, `useEffect`) for state management.

---

🛠 **Tech Stack**

**Frontend**: React.js, Tailwind CSS
**Backend**: Node.js, Express.js
**Database**: MongoDB (with transactions)
**Authentication**: JWT (JSON Web Tokens)



**⚙️ Installation & Setup**

### 1. Clone the repository
git clone https://github.com/ETNA10-7/payment-ui-app.git
cd basic-payment-ui


### 2. Setup Backend
cd backend
npm install

Run the backend:
node index.js (Temporary)


### 3. Setup Frontend
cd frontend
npm install
npm run dev

## 📌 API Endpoints

### Authentication

* `POST /api/auth/signup` → Create new user
* `POST /api/auth/signin` → Authenticate user, return JWT

### User & Transactions (Backend API)

* `GET /api/users` → Fetch all users (with filtering by name)
* `POST /api/transactions/send` → Transfer money between users
* `POST /api/account/add` → Add funds to user account
* `GET /api/account/balance` → Get current balance


## 👨‍💻 Author

**Praharsh Gothankar**

* [LinkedIn](https://www.linkedin.com/in/praharsh-gothankar/)
* [GitHub](https://github.com/your-username)


