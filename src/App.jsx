import { useState, useEffect } from 'react';

// Main App Component with Improved UI
const App = () => {
  // State management (simulated for the demo)
  const [walletAddress, setWalletAddress] = useState('');
  const [displayName, setDisplayName] = useState('User');
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('compose');
  const [inbox, setInbox] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  // Mock data for inbox
  useEffect(() => {
    if (isConnected) {
      setInbox([
        {
          sender: '0x1234...5678',
          timestamp: Date.now() - 86400000, // 1 day ago
          ipfsHash: 'QmXyz...'
        },
        {
          sender: '0xAbcd...Efgh',
          timestamp: Date.now() - 3600000, // 1 hour ago
          ipfsHash: 'QmAbc...'
        },
        {
          sender: '0x0B97...E0fE',
          timestamp: Date.now() - 600000, // 10 minutes ago
          ipfsHash: 'QmPqr...'
        }
      ]);
    }
  }, [isConnected]);

  // UI handlers
  const handleConnect = () => {
    setIsLoading(true);
    setTimeout(() => {
      setWalletAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
      setIsConnected(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress('');
    setInbox([]);
  };

  const handleSendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setModalContent('Message sent successfully!');
      setShowModal(true);
    }, 1500);
  };

  const handleDecrypt = (hash) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setModalContent('This is a decrypted message from the blockchain. Your messages are end-to-end encrypted and can only be read by you and the recipient.');
      setShowModal(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-purple-500 text-3xl">📧</div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Monad Blockchain Email
            </h1>
          </div>
          
          {isConnected ? (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center px-3 py-1 bg-gray-800 rounded-full text-sm">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                <span className="text-gray-300 truncate max-w-[100px] sm:max-w-[200px]">{walletAddress}</span>
              </div>
              <button 
                onClick={handleDisconnect}
                className="px-4 py-2 text-sm bg-purple-700 hover:bg-purple-600 rounded-full font-medium transition"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              onClick={handleConnect}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-full font-medium transition"
              disabled={isLoading}
            >
              {isLoading ? 
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Connecting...</span>
                </span>
                : 'Connect Wallet'
              }
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 bg-red-500/10 border-l-4 border-red-500 px-4 py-3 text-red-200">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}

        {isConnected ? (
          <>
            {/* User Profile Card */}
            <div className="mb-6 bg-gray-800/50 backdrop-blur-sm border border-purple-900/30 rounded-xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center text-white font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{displayName}</h2>
                      <p className="text-gray-400 text-sm truncate max-w-[200px] sm:max-w-md">{walletAddress}</p>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Set display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 w-full sm:w-auto focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex space-x-1 border-b border-gray-700 pb-2">
              <button
                onClick={() => setActiveTab('compose')}
                className={`px-4 py-2 font-medium rounded-t-lg transition ${
                  activeTab === 'compose' 
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                }`}
              >
                Compose
              </button>
              <button
                onClick={() => setActiveTab('inbox')}
                className={`px-4 py-2 font-medium rounded-t-lg transition ${
                  activeTab === 'inbox' 
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                }`}
              >
                Inbox
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-900/30 rounded-xl p-6 shadow-lg">
              {activeTab === 'compose' ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Compose Message</h2>
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Recipient Address</label>
                    <input
                      type="text"
                      placeholder="0x..."
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Message</label>
                    <textarea
                      placeholder="Type your encrypted message here..."
                      rows={5}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Encryption Password</label>
                    <input
                      type="password"
                      placeholder="Minimum 8 characters"
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                  <button
                    onClick={handleSendEmail}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 rounded-lg transition flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Send Message</span>
                      </span>
                    )}
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Your Messages</h2>
                  {inbox.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-gray-400 text-left border-b border-gray-700">
                            <th className="pb-2 font-medium">From</th>
                            <th className="pb-2 font-medium">Time</th>
                            <th className="pb-2 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inbox.map((email, i) => (
                            <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                              <td className="py-3">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                                    {email.sender.charAt(2).toUpperCase()}
                                  </div>
                                  <span className="text-gray-300 truncate max-w-[120px] sm:max-w-[200px]">{email.sender}</span>
                                </div>
                              </td>
                              <td className="py-3 text-gray-400 text-sm">
                                {new Date(email.timestamp).toLocaleString()}
                              </td>
                              <td className="py-3">
                                <div className="flex items-center space-x-2">
                                  <input 
                                    type="password" 
                                    placeholder="Password" 
                                    className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-purple-500 transition w-24 sm:w-32"
                                  />
                                  <button
                                    onClick={() => handleDecrypt(email.ipfsHash)}
                                    className="bg-purple-600 hover:bg-purple-500 text-white text-sm px-3 py-1 rounded-lg transition flex items-center"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                    </svg>
                                    Decrypt
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-300">No messages yet</h3>
                      <p className="text-gray-500 mt-1">Messages you receive will appear here</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-8 relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-75 blur"></div>
              <div className="relative bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center">
                <span className="text-4xl">📧</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to Monad Blockchain Email</h2>
            <p className="text-gray-400 mb-6 text-center max-w-md">Secure, decentralized, and private email communication using blockchain technology and client-side encryption.</p>
            <button 
              onClick={handleConnect}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 rounded-full font-medium transition shadow-lg hover:shadow-purple-500/20 flex items-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Connecting...</span>
                </span>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Connect Wallet</span>
                </>
              )}
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl w-full">
              <div className="bg-gray-800/40 backdrop-blur-sm border border-purple-900/20 rounded-xl p-5 shadow-lg">
                <div className="bg-purple-600/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">End-to-End Encryption</h3>
                <p className="text-gray-400 text-sm">Messages are encrypted on your device and can only be decrypted by the intended recipient.</p>
              </div>
              
              <div className="bg-gray-800/40 backdrop-blur-sm border border-purple-900/20 rounded-xl p-5 shadow-lg">
                <div className="bg-purple-600/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Decentralized Storage</h3>
                <p className="text-gray-400 text-sm">Message contents are stored on IPFS, with only references recorded on the blockchain.</p>
              </div>
              
              <div className="bg-gray-800/40 backdrop-blur-sm border border-purple-900/20 rounded-xl p-5 shadow-lg">
                <div className="bg-purple-600/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Wallet Authentication</h3>
                <p className="text-gray-400 text-sm">No passwords to remember. Your blockchain wallet is your identity and security key.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-purple-900/30 mt-12 py-6 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">Monad Blockchain Email © 2025</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-purple-400 transition">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition">
              <span className="sr-only">Discord</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.6819-.2762-5.4793 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Modal Component */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-800 border border-purple-900/30 rounded-xl p-6 shadow-xl max-w-md w-full mx-4 relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="mb-4">
              <div className="mx-auto w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center">Information</h3>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 my-4">
              <p className="text-gray-300">{modalContent}</p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 rounded-lg transition mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;