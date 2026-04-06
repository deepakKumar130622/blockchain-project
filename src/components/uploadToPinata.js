import axios from "axios";

const PINATA_API_KEY = "c4e3b05e723713098dec";  
const PINATA_SECRET_API_KEY = "5c7b018be0b902b9826447cba73acbe1f1f994690a17b480f070b2cb469ee96b";  
const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkMjZmNGVkYy00N2ExLTQzZTEtYTgyNy1mMzk0N2ZhY2YzNzMiLCJlbWFpbCI6ImRlZXBha2s0NDAzOEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOTAxMTcyNjk2OWJjNzNhZWQxZmUiLCJzY29wZWRLZXlTZWNyZXQiOiJhNGQ2MTliY2E2MDQ3NmI5NTAzYTY5MDM1ZTQ2NjA5OTk4NDdiMDJmMTYxNmU1MmUyNGJlYTdjZWY3YTczMzM2IiwiZXhwIjoxODA1MDQ0MTYzfQ.FjR9g-SxvbXivA5CW5NXBovJiqzv2LfHsn4SviX04p4"; // 🔹 Replace with your JWT token

// 🔹 Upload file to Pinata (IPFS)
export const uploadToPinata = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({ name: file.name });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({ cidVersion: 1 });
    formData.append("pinataOptions", options);

    try {
        const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "pinata_api_key": PINATA_API_KEY,
                "pinata_secret_api_key": PINATA_SECRET_API_KEY,
            },
        });

        console.log("✅ File uploaded to IPFS:", response.data.IpfsHash);
        return response.data.IpfsHash;
    } catch (error) {
        console.error("❌ File upload failed:", error.response?.data || error.message);
        return null;
    }
};

// 🔹 Fetch records from Pinata (IPFS) using Patient Wallet Address
export const fetchRecordsFromIPFS = async (patientWallet) => {
    try {
        const url = `https://api.pinata.cloud/data/pinList?metadata[keyvalues][walletAddress]={"value":"${patientWallet}","op":"eq"}`;
        
        const config = {
            headers: {
                "Authorization": `Bearer ${PINATA_JWT}`,  // Ensure your JWT token is valid
            },
        };

        const response = await axios.get(url, config);

        if (response.data && response.data.rows.length > 0) {
            return response.data.rows.map((record) => ({
                recordId: record.id,
                doctorName: record.metadata.name || "Unknown Doctor",
                age: record.metadata.keyvalues?.age || "N/A",
                bloodGroup: record.metadata.keyvalues?.bloodGroup || "N/A",
                gender: record.metadata.keyvalues?.gender || "N/A",
                fileHash: record.ipfs_pin_hash,
            }));
        }

        return []; // No records found
    } catch (error) {
        console.error("❌ Error fetching patient records:", error.response?.data || error.message);
        throw new Error("Failed to retrieve records from IPFS.");
    }
};
