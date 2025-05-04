import { useState, useEffect } from "react";
import { uploadToPinata } from "./uploadToPinata";
import { encryptMessage, decryptMessage } from "./services/encryptionService";
import blockchainService from "./services/blockchainService";
import "./App.css";

// Import components
import Profile from "./components/Profile";
import EmailForm from "./components/EmailForm";
import Inbox from "./components/Inbox";
import MessagePopup from "./components/MessagePopup";

export default function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [displayName, setDisplayName] = useState(localStorage.getItem("displayName") || "");
  const [isConnected, setIsConnected] = useState(false);
  const [inbox, setInbox] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if wallet is already connected on page load
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const connected = await blockchainService.checkConnection();
        if (connected) {
          setIsConnected(true);
          const address = await blockchainService.getWalletAddress();
          setWalletAddress(address);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };
    
    checkWalletConnection();
  }, []);

  const handleConnect = async () => {
    setError("");
    setIsLoading(true);
    
    try {
      const { address } = await blockchainService.connect();
      setWalletAddress(address);
      setIsConnected(true);
      console.log("Connected to wallet:", address);
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
      console.error("Error connecting to wallet:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    blockchainService.disconnect();
    setIsConnected(false);
    setWalletAddress("");
    setInbox([]);
  };

  const handleSendEmail = async (recipient, message, password) => {
    setError("");
    setIsLoading(true);
    
    try {
      // Encrypt the message
      const encrypted = await encryptMessage(message, password);
      
      // Upload to IPFS via Pinata
      const ipfsHash = await uploadToPinata(encrypted);
      
      // Send transaction to blockchain
      await blockchainService.sendEmail(recipient, ipfsHash);
      
      alert("Message sent successfully!");
      return true;
    } catch (err) {
      setError(err.message || "Failed to send message");
      console.error("Error sending email:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadInbox = async () => {
    setError("");
    setIsLoading(true);
    
    try {
      const data = await blockchainService.getInbox();
      console.log("Inbox loaded:", data);
      setInbox([...data].reverse()); // Display newest first
      return true;
    } catch (err) {
      setError(err.message || "Failed to load inbox");
      console.error("Error loading inbox:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecryptEmail = async (hash, password) => {
    setError("");
    setIsLoading(true);
    
    try {
      // Fetch message from IPFS
      const ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY || "https://gateway.pinata.cloud/ipfs/";
      const res = await fetch(`${ipfsGateway}${hash}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch message: ${res.status}`);
      }
      
      const json = await res.json();
      
      // Decrypt the message
      const message = await decryptMessage(json, password);
      
      // Show popup with decrypted message
      setPopupMessage(message);
      setShowPopup(true);
      
      return true;
    } catch (err) {
      setError(err.message || "Failed to decrypt message");
      console.error("Error decrypting email:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage("");
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="logo-container">
          <img
            src="https://github.com/BluOwn/monadgame/blob/main/logo.png?raw=true"
            alt="Logo"
            className="logo"
          />
        </div>
        <h1 className="app-title">📧 Monad Blockchain Email</h1>

        {error && <div className="error-message">{error}</div>}

        {isConnected && (
          <Profile
            displayName={displayName}
            setDisplayName={setDisplayName}
            walletAddress={walletAddress}
            disconnect={handleDisconnect}
          />
        )}

        <EmailForm
          isConnected={isConnected}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onSendEmail={handleSendEmail}
        />

        <Inbox
          emails={inbox}
          onLoadInbox={handleLoadInbox}
          onDecryptEmail={handleDecryptEmail}
          isConnected={isConnected}
        />

        {showPopup && (
          <MessagePopup
            message={popupMessage}
            onClose={closePopup}
          />
        )}

        <footer className="footer">
          <p>
            Created by: <span>0x0B977acAb5D9B8F654f48090955f5E00973BE0fE</span>
          </p>
          <p>
            Twitter: <a href="https://twitter.com/oprimedev" target="_blank" rel="noopener noreferrer">@oprimedev</a>
          </p>
        </footer>
      </div>
    </div>
  );
}