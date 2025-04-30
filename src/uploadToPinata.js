export const uploadToPinata = async (data) => {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    const formData = new FormData();
    formData.append('file', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'pinata_api_key': '17913b5e655bd05ad05c',
        'pinata_secret_api_key': '86f08ecea9882b3744a52f95ecfa22b6ef9eee16804de357f4fba4524440d1f3'
      },
      body: formData
    });
  
    const json = await res.json();
    if (json && json.IpfsHash) {
      return json.IpfsHash;
    } else {
      throw new Error("Failed to upload to IPFS.");
    }
  };
  