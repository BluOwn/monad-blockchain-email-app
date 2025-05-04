import { useState } from 'react';
import { ethers } from 'ethers';

export default function EmailForm({ 
  isConnected, 
  onConnect, 
  onDisconnect, 
  onSendEmail 
}) {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateAddress = (address) => {
    try {
      return ethers.isAddress(address);
    } catch (err) {
      return false;
    }
  };

  const handleSendEmail = async () => {
    setError("");
    
    // Validate recipient address
    if (!validateAddress(recipient)) {
      setError("Invalid recipient address");
      return;
    }
    
    // Validate message
    if (!message.trim()) {
      setError("Message cannot be empty");
      return;
    }
    
    // Validate password
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    setIsLoading(true);
    try {
      await onSendEmail(recipient, message, password);
      // Clear form on success
      setRecipient("");
      setMessage("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Failed to send email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="email-form">
      <button
        onClick={isConnected ? onDisconnect : onConnect}
        className="connect-button"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : isConnected ? "Disconnect Wallet" : "Connect Wallet"}
      </button>
      
      {error && <p className="error-message">{error}</p>}
      
      <input
        placeholder="Recipient address (0x...)"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="input-field"
        disabled={!isConnected || isLoading}
      />
      
      <textarea
        placeholder="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="textarea-field"
        disabled={!isConnected || isLoading}
      />
      
      <input
        type="password"
        placeholder="Encryption password (min 8 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
        disabled={!isConnected || isLoading}
      />
      
      <button 
        onClick={handleSendEmail} 
        className="send-button"
        disabled={!isConnected || isLoading || !recipient || !message || !password}
      >
        {isLoading ? "Sending..." : "Send Message"}
      </button>
    </div>
  );
}