# Password Generator + Secure Vault

A simple web app for generating strong passwords and storing them securely in a personal vault.

## Features

- Password generator with customizable options (length, character types, exclude look-alikes)
- User authentication (email/password)
- Secure vault for storing passwords, usernames, URLs, and notes
- Client-side encryption for privacy
- Search and filter vault items
- Copy to clipboard with auto-clear (15 seconds)

## Tech Stack

- Frontend: Next.js with TypeScript and Tailwind CSS
- Backend: Next.js API routes
- Database: MongoDB
- Encryption: crypto-js (AES)

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up MongoDB (Atlas free tier recommended)
4. Create `.env.local` with:
   - `MONGODB_URI=your-mongodb-connection-string`
   - `JWT_SECRET=your-jwt-secret`
5. Run the app: `npm run dev`

## Crypto Note

Client-side encryption is implemented using crypto-js AES to encrypt vault items before sending to the server. The server stores only encrypted data, ensuring that plaintext passwords are never stored or transmitted. For this MVP, a fixed key is used; in production, derive the key from user credentials for better security.

## Deployment

Deploy to Vercel or Netlify. Set environment variables in the hosting platform.

## Usage

1. Register/Login
2. Generate passwords or add items to vault
3. Search, edit, delete vault items

## Acceptance Criteria

- Sign up, log in, add item, see encrypted data in DB
- Generator works instantly
- Copy clears after 15 seconds
- Search returns expected items

Repo: [link]

Demo: [link] (after deployment)
