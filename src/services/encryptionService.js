/**
 * Handles message encryption and decryption using AES-GCM
 */

export const encryptMessage = async (text, password) => {
    try {
      const enc = new TextEncoder();
      
      // Import key material
      const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
      );
      
      // Generate a random salt
      const salt = crypto.getRandomValues(new Uint8Array(16));
      
      // Derive the key using PBKDF2
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
      
      // Generate a random initialization vector
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt the message
      const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        enc.encode(text)
      );
      
      // Return the encrypted data with the IV and salt for decryption
      return {
        iv: Array.from(iv),
        salt: Array.from(salt),
        ciphertext: Array.from(new Uint8Array(encrypted))
      };
    } catch (error) {
      console.error("Encryption error:", error);
      throw new Error("Failed to encrypt message: " + error.message);
    }
  };
  
  export const decryptMessage = async (data, password) => {
    try {
      const enc = new TextEncoder();
      const dec = new TextDecoder();
      
      // Import key material
      const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
      );
      
      // Derive the key using PBKDF2 with the stored salt
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
      
      // Decrypt the message using the derived key and stored IV
      const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(data.iv) },
        key,
        new Uint8Array(data.ciphertext)
      );
      
      // Return the decrypted message
      return dec.decode(decrypted);
    } catch (error) {
      console.error("Decryption error:", error);
      throw new Error("Failed to decrypt message. Check your password.");
    }
  };
  
  // Validate password strength
  export const validatePassword = (password) => {
    if (password.length < 8) {
      return { valid: false, message: "Password must be at least 8 characters" };
    }
    
    // Check for additional security requirements as needed
    // Examples:
    // - One uppercase letter
    // - One lowercase letter
    // - One number
    // - One special character
    
    return { valid: true };
  };