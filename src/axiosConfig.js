import axios from "axios";

const ipfsAPI = axios.create({
  baseURL: "https://api.pinata.cloud",
  headers: {
    pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
    pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
  },
});

export default ipfsAPI;
