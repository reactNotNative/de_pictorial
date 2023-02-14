require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

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
      apiKey: "JTTN4EDBCXRHEV39ZCFGNFWV8PEXE1AY8B",
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
  etherscan: {
    apiKey: "JTTN4EDBCXRHEV39ZCFGNFWV8PEXE1AY8B",
  },
  polygonscan: {
    apiKey: "JTTN4EDBCXRHEV39ZCFGNFWV8PEXE1AY8B",
  },
};
