# KaruVerse

**KaruVerse** is an innovative platform for AI-powered artisan commerce, workshops, and verifiable product authenticity backed by Celo NFTs.

## 🚀 Features

- **Artisan Commerce:** A dedicated marketplace for artisans to showcase and sell their unique products.
- **AI-Powered Recommendations:** Leveraging Google's Generative AI to provide personalized experiences and insights.
- **Celo NFT Authenticity:** Verified ownership and authenticity of artisan products using Celo blockchain NFTs.
- **Workshops & Learning:** Host and participate in artisanal workshops.
- **Secure Payments:** Integrated with Razorpay for secure and seamless transactions.
- **Media Management:** Cloudinary integration for robust image and asset handling.

## 🛠️ Technology Stack

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose)
- **AI Integration:** [Google Generative AI](https://ai.google.dev/)
- **Blockchain:** [Ethers.js](https://docs.ethers.org/)
- **Payments:** [Razorpay](https://razorpay.com/)
- **Media Storage:** [Cloudinary](https://cloudinary.com/)

### Smart Contracts
- **Network:** [Celo Sepolia](https://celo.org/)
- **Standard:** ERC-721 (Non-Fungible Tokens)
- **Language:** Solidity

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (local or Atlas)
- Razorpay Account
- Cloudinary Account
- Google Gemini API Key
- Celo testnet/mainnet wallet with funds

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd Karuverse
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` directory based on `.env.example`.
   - Fill in your API keys, MongoDB URI, and other required credentials.
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   - Create a `.env.local` file in the `frontend` directory if required.
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

4. **Smart Contracts:**
   ```bash
   cd ../contracts
   ```
   - Follow instructions in `contracts/README.md` to deploy the `ArtisanNFT` contract to the Celo network.
   - Update the `NFT_CONTRACT_ADDRESS` in the backend `.env` file after deployment.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📄 License

This project is licensed under the MIT License.
