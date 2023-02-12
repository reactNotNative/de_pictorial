import ContractAbi from "./Dstock.json";
import { ethers } from "ethers";

export default function getContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner(
    "0x2C08B4B909F02EA5D8A0E44986720D76BAC8224B" // Random (fake) wallet address
  );
  let contract = new ethers.Contract(
    "0x545ed82953b300ae5a8b21339c942788599Cd239", // Our contract adress
    ContractAbi.abi,
    signer
  );
  return contract;
}
