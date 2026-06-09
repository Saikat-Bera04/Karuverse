# KaruVerse Complete Workflow (Frontend → Backend → AI → IPFS → Celo)

This is the exact workflow I would build for a hackathon. It is simple, scalable, and demonstrates all your core innovations.

---

# 1. User Opens KaruVerse

```text
User
 ↓
Next.js Frontend
 ↓
Landing Page
```

Frontend Pages:

* Home
* Marketplace
* Artisan Dashboard
* Product Details
* Profile

---

# 2. Artisan Registration

```text
Frontend
 ↓
POST /api/auth/register
 ↓
Express Backend
 ↓
MongoDB
 ↓
JWT Generated
 ↓
Frontend Stores Token
```

## MongoDB

Collection:

```text
users
```

Stores:

```json
{
  "name": "Raju Pal",
  "email": "raju@gmail.com",
  "role": "artisan"
}
```

---

# 3. Wallet Connection (Celo)

```text
RainbowKit
 ↓
WalletConnect / MetaMask / Valora
 ↓
Connect to Celo Alfajores
 ↓
Get Wallet Address
 ↓
POST /api/auth/wallet-connect
 ↓
MongoDB Updates User
```

Stores:

```json
{
  "walletAddress": "0xABC..."
}
```

---

# 4. Artisan Creates Product

Dashboard:

```text
Upload Product
```

Fields:

* Product Name
* Craft Type
* Materials
* Hours Worked
* Price
* Description
* Images

---

# 5. Frontend Upload Flow

```text
Frontend
 ↓
FormData
 ↓
POST /api/products
 ↓
Backend
```

Request:

```http
multipart/form-data
```

Contains:

```text
images
title
craftType
materials
hoursWorked
price
```

---

# 6. Backend Receives Product

```text
Express Controller
 ↓
Multer Middleware
 ↓
Images Extracted
```

---

# 7. Upload Images to Pinata

```text
Backend
 ↓
Pinata Files API
 ↓
IPFS
```

Returns:

```json
{
    "cid":"Qm123..."
}
```

Image URL:

```text
ipfs://Qm123...
```

---

# 8. AI Description Generation

Backend automatically calls OpenAI.

```text
Backend
 ↓
OpenAI API
```

Prompt:

```text
Generate an emotional product story
for a handmade Bankura terracotta horse.
Mention Bengali heritage.
```

OpenAI returns:

```json
{
    "story":"Crafted in the heart of Bankura..."
}
```

---

# 9. AI Price Recommendation

```text
materials
hoursWorked
craftType
 ↓
OpenAI
```

Returns:

```json
{
    "suggestedPrice": 1800
}
```

Frontend shows:

```text
Suggested Price: ₹1800
Use Suggested Price?
```

---

# 10. Generate NFT Metadata

Backend creates:

```json
{
  "name":"Bankura Horse",
  "description":"Crafted in Bankura...",
  "image":"ipfs://Qm123...",
  "artisan":"Raju Pal",
  "district":"Bankura",
  "craftType":"Terracotta"
}
```

---

# 11. Upload Metadata to Pinata

```text
Backend
 ↓
Pinata JSON API
 ↓
IPFS
```

Returns:

```json
{
    "cid":"QmMetadata..."
}
```

Metadata URI:

```text
ipfs://QmMetadata...
```

---

# 12. Mint NFT on Celo Alfajores

```text
Backend
 ↓
Ethers.js
 ↓
NFT Contract
 ↓
Celo Alfajores
```

Calls:

```solidity
mintNFT(
    artisanWallet,
    metadataURI,
    artisanName,
    craftType
)
```

Returns:

```json
{
    "tokenId":"15",
    "txHash":"0x123..."
}
```

---

# 13. Save Product to MongoDB

Collections:

```text
products
nfts
```

Product:

```json
{
  "title":"Bankura Horse",
  "price":1800,
  "images":["ipfs://Qm123"],
  "story":"Crafted in Bankura...",
  "tokenId":"15",
  "verified":true
}
```

NFT:

```json
{
  "tokenId":"15",
  "contractAddress":"0x...",
  "owner":"0xABC..."
}
```

---

# 14. Return Success to Frontend

Backend:

```json
{
    "success": true,
    "product": {...},
    "tokenId": 15
}
```

Frontend:

Shows:

```text
✓ Product Published
✓ NFT Minted
✓ Verified on Celo
```

---

# 15. Marketplace Display

```text
Frontend
 ↓
GET /api/products
 ↓
Backend
 ↓
MongoDB
 ↓
Return Products
```

Cards show:

* Product Image
* Price
* Artisan Name
* NFT Verified Badge
* Story Preview

---

# 16. Product Details Page

```text
GET /api/products/:id
```

Shows:

## Left

* Image Gallery

## Right

* Price
* Story
* Buy Button

## Bottom

* NFT Certificate
* Token ID
* Celo Transaction Link
* Artisan Profile

---

# 17. NFT Verification

Buyer clicks:

```text
Verify Authenticity
```

Flow:

```text
Frontend
 ↓
GET /api/nft/verify/:tokenId
 ↓
Backend
 ↓
Celo Contract
 ↓
MongoDB
```

Returns:

```json
{
    "verified": true,
    "artisan":"Raju Pal",
    "mintedAt":"2026-06-09"
}
```

Frontend shows:

```text
✓ Authentic Bengali Craft
Verified on Celo
```

---

# 18. Purchase Flow

```text
Buyer
 ↓
Buy Now
 ↓
POST /api/orders
 ↓
Razorpay Checkout
 ↓
Payment Success
 ↓
MongoDB Order Created
```

Collections:

```text
orders
payments
```

---

# 19. Optional Live Workshops

If implemented:

```text
Artisan Creates Workshop
 ↓
POST /api/workshops
 ↓
MongoDB
 ↓
LiveKit Room Created
 ↓
Audience Joins
```

---

# Complete Architecture Diagram

```text
                    ┌──────────────┐
                    │   Frontend   │
                    │  Next.js App │
                    └──────┬───────┘
                           │
                           ▼
                  ┌────────────────┐
                  │ Express Backend│
                  │   Node.js API  │
                  └─────┬─────┬────┘
                        │     │
          ┌─────────────┘     └───────────────┐
          ▼                                   ▼
 ┌─────────────────┐                ┌─────────────────┐
 │    MongoDB      │                │     OpenAI      │
 │ Users/Products  │                │ Story + Pricing │
 └─────────────────┘                └─────────────────┘
          │
          │
          ▼
 ┌─────────────────┐
 │     Pinata      │
 │ IPFS Storage    │
 └─────────────────┘
          │
          ▼
 ┌─────────────────┐
 │ Celo Alfajores  │
 │ NFT Contract    │
 └─────────────────┘
          │
          ▼
 ┌─────────────────┐
 │   Marketplace   │
 │ Verified Crafts │
 └─────────────────┘
```

# Judge Demo Flow (2 Minutes)

```text
Connect Wallet
↓
Upload Terracotta Product
↓
AI Generates Story
↓
Pinata Uploads to IPFS
↓
NFT Minted on Celo
↓
Product Appears in Marketplace
↓
Judge Clicks Verify
↓
NFT Authenticity Proven
```

This is the strongest end-to-end flow for KaruVerse because it clearly demonstrates the three pillars of your idea:

**AI for empowerment → IPFS for permanence → Celo for trust and authenticity.**
