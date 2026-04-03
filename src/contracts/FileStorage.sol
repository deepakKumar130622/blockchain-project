// FileStorage.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    mapping(address => string) public fileHashes;

    event FileUploaded(address indexed user, string ipfsHash);

    function storeIPFSHash(string memory _ipfsHash) public {
        fileHashes[msg.sender] = _ipfsHash;
        emit FileUploaded(msg.sender, _ipfsHash);
    }

    function getFileHash(address user) public view returns (string memory) {
        return fileHashes[user];
    }
}
