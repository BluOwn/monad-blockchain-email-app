# Monad Blockchain Email

A decentralized email application built on Ethereum blockchain with client-side encryption.

## Features

- Send encrypted messages via Ethereum blockchain
- Client-side AES-GCM encryption/decryption
- IPFS storage via Pinata
- MetaMask wallet integration
- Responsive design

## Security Features

- End-to-end encryption
- No private keys or passwords stored
- Decentralized storage on IPFS
- Message contents are never visible on-chain

## Prerequisites

- Node.js 16+ and npm/yarn
- MetaMask browser extension
- Ethereum testnet or mainnet access
- Pinata account for IPFS storage

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/monad-blockchain-email.git
cd monad-blockchain-email
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
VITE_CONTRACT_ADDRESS=0xYourContractAddressHere
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_API_KEY=your_pinata_secret_key
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
/src
  /components    - React components
  /services      - Services for blockchain, encryption, etc.
  /assets        - Static assets
  App.jsx        - Main application component
  main.jsx       - Entry point
```

## Smart Contract

The application uses a smart contract deployed on Ethereum. The contract ABI is included in the project. The contract includes the following functions:

- `sendEmail`: Send an email to a recipient
- `getInbox`: Get all emails sent to the caller

## Usage

1. Connect your MetaMask wallet
2. Enter recipient address, message, and encryption password
3. Send the message
4. Load your inbox to see received messages
5. Decrypt messages with the correct password

## Security Considerations

- Never share your encryption passwords
- The app never stores or transmits your passwords
- Only the IPFS hash is stored on the blockchain, not the content
- Messages are encrypted before being uploaded to IPFS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.