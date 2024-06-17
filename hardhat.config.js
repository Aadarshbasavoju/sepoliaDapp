module.exports = {
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.SEPOLIA_PRIVATE_KEY}`]
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  },
  solidity: "0.8.0"
};
