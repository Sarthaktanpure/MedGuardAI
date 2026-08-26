import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    amoy: {
      url: process.env.CHAIN_RPC_URL ?? "",
      accounts: process.env.CHAIN_PRIVATE_KEY ? [process.env.CHAIN_PRIVATE_KEY] : []
    }
  }
};

export default config;
