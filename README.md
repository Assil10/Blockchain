
# Blockchain Real Estate Investment Platform

This project implements a **Blockchain-based Real Estate Investment Platform** that allows users to make investments in real estate projects using **fiat currency** through **Paymee** while maintaining transparency and immutability via the **Ethereum blockchain**. The platform facilitates project creation, investment tracking, and rent distribution for investors.

---

## **Features**

- **User Registration**: Users can register with their wallet address, email, and name.
- **Project Management**: Admins can create, update, and manage real estate projects, including funding goals.
- **Investment Management**: Users can invest in projects via Paymee and confirm payments via callbacks.
- **Blockchain Integration**: Investments are recorded on the Ethereum blockchain for transparency.
- **Rent Distribution**: Rent is distributed proportionally to investors based on their share of the investment.
- **Paymee Integration**: Paymee handles fiat payments and processes user transactions.

---

## **Technologies & Tools**

- **Node.js** - JavaScript runtime for server-side application logic.
- **Express.js** - Web framework for building the RESTful API.
- **MySQL** - Database for storing user, investment, and project data.
- **Ethers.js** - Ethereum JavaScript library for interacting with smart contracts.
- **Solidity** - Smart contract language for Ethereum.
- **Infura** - Ethereum RPC provider for connecting to the Ethereum network.
- **Paymee API** - Payment gateway for processing Tunisian Dinar (TND) investments.
- **Metamask** - Wallet provider for managing user addresses.
- **GitHub Actions** - CI/CD pipeline for automatic deployment.
- **Docker** (optional) - Containerization of your application for consistent deployments.

---

## **Project Setup**

### **1. Clone the Repository**

To get started, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/blockchain-investment-platform.git
cd blockchain-investment-platform
```

### **2. Install Dependencies**

Install the required dependencies for the project:

```bash
npm install
```

### **3. Configure Environment Variables**

Create a `.env` file in the root of the project and add the following environment variables:

```env
PRIVATE_KEY=your_ethereum_private_key
INFURA_API_KEY=your_infura_project_id
PAYMEE_API_KEY=your_paymee_api_key
PAYMEE_MERCHANT_ID=your_paymee_merchant_id
PAYMEE_CALLBACK_URL=https://your-deployed-backend.com/api/payment/callback
INVESTMENT_CONTRACT_ADDRESS=your_investment_contract_address
INFURA_SEPOLIA=https://sepolia.infura.io/v3/your_infura_project_id

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=korpor_dev
```

### **4. Start the Backend**

To start the application in development mode, run:

```bash
npm run dev
```

This will start the server on `http://localhost:5000`.

---

## **Endpoints**

### **User Endpoints**
- **POST /api/users/register**: Register a new user with wallet address, email, and full name.
- **GET /api/users/:walletAddress**: Get a user's profile by wallet address (includes investments and rent history).

### **Project Endpoints**
- **POST /api/projects**: Create a new project.
- **GET /api/projects**: Get all projects.
- **GET /api/projects/:id**: Get a specific project by ID.
- **PUT /api/projects/:id**: Update a project’s goal amount, status, or description.

### **Investment Endpoints**
- **POST /api/investments**: Create an investment for a project.
- **GET /api/investments**: Get all investments.
- **GET /api/investments/:walletAddress**: Get investments by user’s wallet address.

### **Payment Callback**
- **POST /api/payment/callback**: Paymee will send the payment status to this endpoint after the user completes the transaction.

### **Rent Distribution**
- **POST /api/rent/distribute**: Admin can distribute rent to investors.

---

### **Hosting and Paymee Integration**

- **Backend Hosting**: Deploy to **Render**, **Heroku**, **Railway**, or any cloud platform that supports Node.js applications.
- **Paymee Integration**: Ensure that **Paymee**'s **live API** credentials are used in production, not sandbox. Set up the **`notify_url`** in your Paymee dashboard to your backend's live callback URL.

---

## **Smart Contract Deployment**

1. **Deploy the Smart Contract**: Deploy the `InvestmentManager.sol` smart contract on the Ethereum network using **Remix IDE** or **Truffle**. Get the contract address after deployment.
2. **Set Contract Address in `.env`**: Add the deployed contract address in the `.env` file:
   ```env
   INVESTMENT_CONTRACT_ADDRESS=your_deployed_contract_address
   ```

---

## **Troubleshooting**

1. **Error: Missing Paymee Token or Payment URL**: Double-check that Paymee’s response contains both the `payment_url` and `paymee_ref`. Ensure you are using the **production API endpoint**.
2. **Blockchain Errors**: If your blockchain transaction fails, check the contract logs via **Etherscan** and ensure you have enough **ETH for gas**.
3. **Database Connection**: Make sure your database credentials in the `.env` file are correct and the MySQL service is running.

---

## **License**

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

Let me know if you need any modifications or additions!
