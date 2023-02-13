require("dotenv").config();
// console.log(process.env);
module.exports = {
  solidity: "0.8.17",

  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    maticmumbai: {
      url: process.env.POLYGON_ALCHEMY,
      accounts: [
        "3aa8c280f6a6e07b0eb5d046eaa92330a51f226d6f4a47945145bb613f4dbc31",
      ],
    },
  },

  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  // etherscan: {

  //   apiKey: "HBMB8ER9AI26GMHR2IAGYK6KS3AX3FA6J1"
  // }
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API,
  },
};
