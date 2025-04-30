import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { uploadToPinata } from "./uploadToPinata";
import { contractABI } from "./contractABI";
import "./App.css";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [inbox, setInbox] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [decryptPasswords, setDecryptPasswords] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [walletAddress, setWalletAddress] = useState("");
  const [displayName, setDisplayName] = useState(localStorage.getItem("displayName") || "");
  const [copyFeedback, setCopyFeedback] = useState("");
  const emailsPerPage = 5;

  useEffect(() => {
    if (isConnected && signer) {
      const fetchAddress = async () => {
        try {
          const address = await signer.getAddress();
          setWalletAddress(address);
        } catch (err) {
          console.error("Error fetching wallet address:", err);
        }
      };
      fetchAddress();
    }
  }, [isConnected, signer]);

  const init = async () => {
    if (!contractAddress) {
      alert("Contract address is not configured. Please check environment variables.");
      console.error("VITE_CONTRACT_ADDRESS is missing:", import.meta.env.VITE_CONTRACT_ADDRESS);
      return;
    }

    if (window.ethereum) {
      try {
        const prov = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = await prov.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        setProvider(prov);
        setSigner(signer);
        setContract(contract);
        setIsConnected(true);
        console.log("Connected to wallet:", await signer.getAddress());
      } catch (err) {
        console.error("Error connecting to wallet:", err);
        alert("Failed to connect to MetaMask. Please try again.");
      }
    } else {
      alert("MetaMask not found! Please install MetaMask.");
    }
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setIsConnected(false);
    setInbox([]);
    setWalletAddress("");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopyFeedback("Copied!");
    setTimeout(() => setCopyFeedback(""), 2000);
  };

  const handleDisplayNameChange = (value) => {
    setDisplayName(value);
    localStorage.setItem("displayName", value);
  };

  const encryptMessage = async (text, password) => {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt"]
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      enc.encode(text)
    );
    return {
      iv: Array.from(iv),
      salt: Array.from(salt),
      ciphertext: Array.from(new Uint8Array(encrypted))
    };
  };

  const decryptMessage = async (data, password) => {
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    const key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new Uint8Array(data.salt),
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["decrypt"]
    );
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(data.iv) },
      key,
      new Uint8Array(data.ciphertext)
    );
    return dec.decode(decrypted);
  };

  const sendEmail = async () => {
    if (!contract || !recipient || !message || !password) return alert("All fields are required.");
    const encrypted = await encryptMessage(message, password);
    const ipfsHash = await uploadToPinata(encrypted);
    const tx = await contract.sendEmail(recipient, ipfsHash);
    await tx.wait();
    alert("Message sent!");
    setRecipient("");
    setMessage("");
    setPassword("");
  };

  const loadInbox = async () => {
    if (!contract) return;
    console.log("Loading inbox...");
    try {
      const data = await contract.getInbox();
      console.log("Inbox loaded:", data);
      setInbox([...data].reverse());
    } catch (err) {
      console.error("Error loading inbox:", err);
    }
  };

  const decryptEmail = async (hash, index) => {
    const password = decryptPasswords[index];
    if (!password) return alert("Enter decryption password.");
    try {
      const res = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
      const json = await res.json();
      const msg = await decryptMessage(json, password);
      setPopupMessage(msg);
      setShowPopup(true);
    } catch (err) {
      alert("Decryption failed. Check your password.");
      console.error("Decryption error:", err);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage("");
  };

  const handlePasswordChange = (index, value) => {
    setDecryptPasswords((prev) => ({ ...prev, [index]: value }));
  };

  // Pagination logic
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = inbox.slice(indexOfFirstEmail, indexOfLastEmail);
  const totalPages = Math.ceil(inbox.length / emailsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        <h1 className="app-title">📧 Blockchain Email</h1>

        {isConnected && (
          <div className="profile-card">
            <h2 className="profile-title">{displayName || "User Profile"}</h2>
            <p className="profile-address">
              <span>Wallet:</span> {walletAddress}
            </p>
            <div className="profile-actions">
              <input
                type="text"
                placeholder="Set display name"
                value={displayName}
                onChange={(e) => handleDisplayNameChange(e.target.value)}
                className="profile-input"
              />
              <button onClick={copyAddress} className="copy-button">
                {copyFeedback || "Copy Address"}
              </button>
              <button onClick={disconnect} className="disconnect-button">
                Disconnect Wallet
              </button>
            </div>
          </div>
        )}

        <div className="email-form">
          <button
            onClick={isConnected ? disconnect : init}
            className="connect-button"
          >
            {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
          </button>
          <input
            placeholder="Recipient address (0x...)"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="input-field"
          />
          <textarea
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="textarea-field"
          />
          <input
            type="password"
            placeholder="Encryption password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <button onClick={sendEmail} className="send-button">
            Send Message
          </button>
        </div>

        <div className="inbox-section">
          <button onClick={loadInbox} className="load-inbox-button">
            Load Inbox
          </button>
          {currentEmails.length > 0 ? (
            <table className="email-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Time</th>
                  <th>Decrypt</th>
                </tr>
              </thead>
              <tbody>
                {currentEmails.map((item, i) => (
                  <tr key={i}>
                    <td>{item.sender}</td>
                    <td>{new Date(Number(item.timestamp) * 1000).toLocaleString()}</td>
                    <td>
                      <div className="decrypt-group">
                        <input
                          type="password"
                          placeholder="Password"
                          value={decryptPasswords[indexOfFirstEmail + i] || ""}
                          onChange={(e) => handlePasswordChange(indexOfFirstEmail + i, e.target.value)}
                          className="decrypt-input"
                        />
                        <button
                          onClick={() => decryptEmail(item.ipfsHash, indexOfFirstEmail + i)}
                          className="decrypt-button"
                        >
                          Decrypt
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-emails">No emails found.</p>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={currentPage === i + 1 ? "pagination-button active" : "pagination-button"}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>Decrypted Message</h2>
              <p>{popupMessage}</p>
              <button onClick={closePopup} className="close-popup-button">
                Close
              </button>
            </div>
          </div>
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
