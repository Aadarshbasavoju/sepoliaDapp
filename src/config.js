export const CONTRACT_ADDRESS = '0x0c8a7C894414a769396De95eA2a741437e52c2c9';
export const CONTRACT_ABI = [
  // Replace with the ABI of your deployed contract
  {
    "inputs": [],
    "name": "getData",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_data",
        "type": "string"
      }
    ],
    "name": "setData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
