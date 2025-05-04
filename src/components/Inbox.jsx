import { useState, useEffect } from 'react';

export default function Inbox({ 
  emails, 
  onLoadInbox, 
  onDecryptEmail,
  isConnected 
}) {
  const [decryptPasswords, setDecryptPasswords] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const emailsPerPage = 5;

  // Reset pagination when emails change
  useEffect(() => {
    setCurrentPage(1);
  }, [emails]);

  const handleLoadInbox = async () => {
    setIsLoading(true);
    try {
      await onLoadInbox();
    } catch (error) {
      console.error("Failed to load inbox:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (index, value) => {
    setDecryptPasswords((prev) => ({ ...prev, [index]: value }));
  };

  const handleDecrypt = async (hash, index) => {
    const password = decryptPasswords[index];
    if (!password) return alert("Enter decryption password.");
    
    try {
      await onDecryptEmail(hash, password);
      // Clear password after successful decryption
      setDecryptPasswords((prev) => {
        const newPasswords = { ...prev };
        delete newPasswords[index];
        return newPasswords;
      });
    } catch (error) {
      console.error("Decryption failed:", error);
    }
  };

  // Pagination logic
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = emails.slice(indexOfFirstEmail, indexOfLastEmail);
  const totalPages = Math.ceil(emails.length / emailsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="inbox-section">
      <button 
        onClick={handleLoadInbox} 
        className="load-inbox-button"
        disabled={!isConnected || isLoading}
      >
        {isLoading ? "Loading..." : "Load Inbox"}
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
                      onClick={() => handleDecrypt(item.ipfsHash, indexOfFirstEmail + i)}
                      className="decrypt-button"
                      disabled={!decryptPasswords[indexOfFirstEmail + i]}
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
        <p className="no-emails">
          {isLoading ? "Loading emails..." : "No emails found."}
        </p>
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
  );
}