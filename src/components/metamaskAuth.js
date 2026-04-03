import Web3 from "web3";

export const connectMetaMask = async () => {
    if (window.ethereum) {
        try {
            const web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const accounts = await web3.eth.getAccounts();
            return accounts[0]; // Return the connected wallet address
        } catch (error) {
            console.error("MetaMask connection failed:", error);
            return null;
        }
    } else {
        alert("MetaMask is not installed. Please install MetaMask.");
        return null;
    }
};
