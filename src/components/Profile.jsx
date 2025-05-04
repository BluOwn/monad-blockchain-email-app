import { useState } from 'react';

export default function Profile({ 
  displayName, 
  setDisplayName, 
  walletAddress, 
  disconnect 
}) {
  const [copyFeedback, setCopyFeedback] = useState("");

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopyFeedback("Copied!");
    setTimeout(() => setCopyFeedback(""), 2000);
  };

  const handleDisplayNameChange = (value) => {
    setDisplayName(value);
    localStorage.setItem("displayName", value);
  };

  return (
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
  );
}