require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",

  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    maticmumbai: {
      url: process.env.POLYGON_ALCHEMY,
      accounts: [
        process.env.PRIVATE_KEY_1,
        process.env.PRIVATE_KEY_2,
        process.env.PRIVATE_KEY_3,
      ],
    },
  },
  // etherscan: {

  //   apiKey: "HBMB8ER9AI26GMHR2IAGYK6KS3AX3FA6J1"
  // }
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API,
  },
};
