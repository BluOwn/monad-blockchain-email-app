import { ethers } from "ethers";
import { contractABI } from "../contractABI";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.isConnected = false;
  }

  async connect() {
    if (!contractAddress) {
      throw new Error("Contract address is not configured");
    }

    if (!window.ethereum) {
      throw new Error("MetaMask not found! Please install MetaMask");
    }

    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      
      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      // Create contract instance
      this.contract = new ethers.Contract(contractAddress, contractABI, this.signer);
      
      this.isConnected = true;
      
      // Set up event listeners for account changes
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      });
      
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
      
      return {
        address: await this.signer.getAddress()
      };
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      throw new Error("Failed to connect to wallet: " + error.message);
    }
  }

  disconnect() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.isConnected = false;
  }

  async getWalletAddress() {
    if (!this.isConnected || !this.signer) {
      throw new Error("Wallet not connected");
    }
    
    return await this.signer.getAddress();
  }

  async sendEmail(to, ipfsHash) {
    if (!this.isConnected || !this.contract) {
      throw new Error("Wallet not connected");
    }
    
    if (!ethers.isAddress(to)) {
      throw new Error("Invalid recipient address");
    }
    
    try {
      const tx = await this.contract.sendEmail(to, ipfsHash);
      return await tx.wait();
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send message: " + error.message);
    }
  }

  async getInbox() {
    if (!this.isConnected || !this.contract) {
      throw new Error("Wallet not connected");
    }
    
    try {
      return await this.contract.getInbox();
    } catch (error) {
      console.error("Error loading inbox:", error);
      throw new Error("Failed to load inbox: " + error.message);
    }
  }
  
  // Check if the wallet is already connected on page load
  async checkConnection() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          // User is already connected
          await this.connect();
          return true;
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
    return false;
  }
}

// Create and export a singleton instance
const blockchainService = new BlockchainService();
export default blockchainService;