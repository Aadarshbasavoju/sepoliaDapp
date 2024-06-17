import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config';
import './App.css';

function App() {
  const [data, setData] = useState('');
  const [newData, setNewData] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      // Example for connecting to a local Hardhat node
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

      setProvider(provider);
      const signer = provider.getSigner();
      setSigner(signer);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contract);
    };

    init();
  }, []);

  const fetchData = async () => {
    if (contract) {
      const data = await contract.getData();
      setData(data);
    }
  };

  const updateData = async () => {
    if (contract && newData) {
      const tx = await contract.setData(newData);
      await tx.wait();
      setNewData('');
      fetchData();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Web3 DApp on Sepolia Testnet</h1>
        <button onClick={fetchData}>Fetch Data</button>
        <p>Current Data: {data}</p>
        <input 
          type="text" 
          placeholder="Enter new data" 
          value={newData}
          onChange={(e) => setNewData(e.target.value)}
        />
        <button onClick={updateData}>Update Data</button>
      </header>
    </div>
  );
}

export default App;
