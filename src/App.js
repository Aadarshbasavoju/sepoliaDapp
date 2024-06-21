import React, { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import './App.css';



function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [network, setNetwork] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [text, setText] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');

  // Connects to MetaMask and retrieves account info
  const connectWallet = useCallback(async () => {
    try {
      console.log('Connecting to MetaMask...');
      const detectedProvider = await detectEthereumProvider();
      if (detectedProvider) {
        console.log('MetaMask is detected!');
        const web3Provider = new ethers.providers.Web3Provider(detectedProvider);
        setProvider(web3Provider);
        await detectedProvider.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0) {
          const account = accounts[0];
          console.log('Connected account:', account);
          setAccount(account);
          const network = await web3Provider.getNetwork();
          setNetwork(network.name);
          if (network.chainId !== 11155111) {
            setErrorMessage('Please connect to the Sepolia network in MetaMask.');
          } else {
            setErrorMessage('');
            const balance = await web3Provider.getBalance(account);
            setEthBalance(ethers.utils.formatEther(balance));
          }
        }
        detectedProvider.on('accountsChanged', (accounts) => {
          if (accounts.length > 0) {
            console.log('Account changed:', accounts[0]);
            setAccount(accounts[0]);
            web3Provider.getBalance(accounts[0]).then(balance => {
              setEthBalance(ethers.utils.formatEther(balance));
            });
          } else {
            setAccount(null);
          }
        });
        detectedProvider.on('chainChanged', () => {
          console.log('Network changed');
          window.location.reload();
        });
      } else {
        console.error('MetaMask not detected.');
        setErrorMessage('MetaMask not detected. Please install MetaMask.');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      setErrorMessage('Error connecting to MetaMask. Check console for details.');
    }
  }, []);

  // Sends a transaction with text data
  const sendTransaction = async () => {
    if (!account) {
      setErrorMessage('Connect to MetaMask first.');
      return;
    }
    if (!text) {
      setErrorMessage('Please enter some text to send.');
      return;
    }
    try {
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: account,
        value: ethers.utils.parseEther('0.001'),
        data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(text)),
      });
      console.log('Transaction sent:', tx);
      setTransactionStatus('Transaction sent. Waiting for confirmation...');
      await tx.wait();
      setTransactionStatus('Transaction confirmed!');
    } catch (error) {
      console.error('Error sending transaction:', error);
      setErrorMessage('Error sending transaction. Check console for details.');
    }
  };

  // Initial MetaMask connection check
  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sepolia Dapp</h1>
        {!account && (
          <button onClick={connectWallet}>Connect MetaMask</button>
        )}
        {account && (
          <div>
            <p>Connected Account: {account}</p>
            <p>Network: {network}</p>
            <p>Balance: {ethBalance} ETH</p>
            <input
              type="text"
              placeholder="Enter text to send"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="text-input"
            />
            <button onClick={sendTransaction}>Send Text as Transaction</button>
            {transactionStatus && <p>{transactionStatus}</p>}
          </div>
        )}
        {errorMessage && <p className="error">{errorMessage}</p>}
      </header>
    </div>
  );
}

export default App;
