// Create a .env file in your project root with:
// VITE_PINATA_API_KEY=your_api_key
// VITE_PINATA_SECRET_API_KEY=your_secret_key

export const uploadToPinata = async (data) => {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  const formData = new FormData();
  formData.append('file', new Blob([JSON.stringify(data)], { type: 'application/json' }));

  try {
    const apiKey = import.meta.env.VITE_PINATA_API_KEY;
    const secretKey = import.meta.env.VITE_PINATA_SECRET_API_KEY;
    
    if (!apiKey || !secretKey) {
      throw new Error("Pinata API keys not configured");
    }
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'pinata_api_key': apiKey,
        'pinata_secret_api_key': secretKey
      },
      body: formData
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const json = await res.json();
    if (json && json.IpfsHash) {
      return json.IpfsHash;
    } else {
      throw new Error("Failed to upload to IPFS: " + JSON.stringify(json));
    }
  } catch (error) {
    console.error("IPFS upload error:", error);
    throw new Error("Failed to upload to IPFS: " + error.message);
  }
};