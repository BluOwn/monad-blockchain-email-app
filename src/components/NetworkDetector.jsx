function NetworkDetector() {
    const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);
    const expectedChainId = import.meta.env.VITE_CHAIN_ID || '0x1'; // Default to Ethereum mainnet
    
    useEffect(() => {
      const checkNetwork = async () => {
        if (window.ethereum) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setIsCorrectNetwork(chainId === expectedChainId);
          
          // Set up listener for network changes
          window.ethereum.on('chainChanged', (newChainId) => {
            setIsCorrectNetwork(newChainId === expectedChainId);
          });
        }
      };
      
      checkNetwork();
      
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('chainChanged', () => {});
        }
      };
    }, []);
    
    if (!isCorrectNetwork) {
      return (
        <div className="error-message">
          You are on the wrong network. Please switch to the appropriate Ethereum network.
        </div>
      );
    }
    
    return null;
  }