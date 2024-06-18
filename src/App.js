import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import './App.css'; // Assuming you have some basic styling

const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  
  const contractAddress = 'YOUR_SMART_CONTRACT_ADDRESS_HERE'; // Replace with your contract address
  const contractABI = [
    // Paste your contract's ABI here
  ];

  useEffect(() => {
    const init = async () => {
      const ethereumProvider = await detectEthereumProvider();
      if (ethereumProvider) {
        const ethersProvider = new ethers.providers.Web3Provider(ethereumProvider);
        setProvider(ethersProvider);
        
        const ethersSigner = ethersProvider.getSigner();
        setSigner(ethersSigner);

        const accounts = await ethersProvider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
        
        const deployedContract = new ethers.Contract(contractAddress, contractABI, ethersSigner);
        setContract(deployedContract);
      } else {
        console.error('Please install MetaMask!');
      }
    };

    init();
  }, []);

  const connectWallet = async () => {
    if (provider) {
      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    }
  };

  const performTransaction = async () => {
    if (contract) {
      try {
        const tx = await contract.YOUR_FUNCTION_NAME_HERE(); // Replace with your contract's function
        await tx.wait();
        console.log('Transaction successful:', tx);
      } catch (error) {
        console.error('Transaction failed:', error);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sepolia dApp</h1>
        {account ? (
          <div>
            <p>Connected Account: {account}</p>
            <button onClick={performTransaction}>Perform Transaction</button>
          </div>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </header>
    </div>
  );
};

export default App;
