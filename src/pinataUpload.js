import axios from "axios";

const PINATA_API_KEY = "9011726969bc73aed1fe";
const PINATA_SECRET_API_KEY = "a4d619bca60476b9503a69035e4660999847b02f1616e52e24bea7cef7a73336";
const PINATA_ENDPOINT = "https://api.pinata.cloud/pinning/pinFileToIPFS";

export const uploadToPinata = async (file) => {
    try {
        // 🔹 Ensure file is provided
        if (!file) throw new Error("❌ No file provided for upload.");

        // 🔹 Ensure file is an instance of File or Blob
        if (!(file instanceof File || file instanceof Blob)) {
            throw new Error("❌ Invalid file: Ensure you are passing a File or Blob object.");
        }

        // 🔹 Log File Details
        console.log("📂 Preparing File for Upload:", {
            name: file.name || "Unnamed file",
            type: file.type,
            size: file.size + " bytes",
        });

        // 🔹 Create FormData
        const formData = new FormData();
        formData.append("file", file);

        // 🔹 Send request to Pinata
        const response = await axios.post(PINATA_ENDPOINT, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_API_KEY,
            },
        });

        console.log("✅ File uploaded to Pinata IPFS:", response.data);
        return response.data.IpfsHash;
    } catch (error) {
        console.error("❌ Error uploading file to Pinata:", error.response?.data || error.message);
        return null;
    }
};
