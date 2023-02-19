import { ethers } from 'ethers';
import { obj } from '../constants/contract';
export function getContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log('Contract Address', obj.contractAddress);
  const signer = provider.getSigner();
  let contract = new ethers.Contract(
    obj.contractAddress, // Our contract adress
    obj.contractABI, // Our contract ABI
    signer
  );
  return contract;
}
// function to register a new user
export async function registerUser1(account) {
  let contract = getContract();
  let tx = await contract.registerUser(account);
  let receipt = await tx.wait();
  return receipt;
}
//check if user is registered
export async function isUserRegistered() {
  let contract = getContract();
  let isRegistered = await contract.isUserRegistered();
  return isRegistered;
}

// function to create licences
export async function createLicence(price, Duration, _metaData) {
  let contract = getContract();
  let tx = await contract.createLicense(price, Duration, _metaData);
  let receipt = await tx.wait();
  return receipt;
}
// function getAllAtomicsByItemType
export async function getAllAtomicsByItemType(_itemType) {
  let contract = getContract();
  let atomics = await contract.getAllAtomicsByItemType(_itemType);
  return atomics;
}

// function getAllCollectionsByItemType
export async function getAllCollectionsByItemType(_itemType) {
  let contract = getContract();
  let collections = await contract.getAllCollectionsByItemType(_itemType);
  return collections;
}
// function to create a DeItem using createDeItem function in contract (_assetType , _itemType , _licenseIds, _metaData)

export async function createDeItem(
  _assetType,
  _itemType,
  _licenseIds,
  _metaData
) {
  let contract = getContract();
  let tx = await contract.createDeItem(
    _assetType,
    _itemType,
    _licenseIds,
    _metaData
  );
  let receipt = await tx.wait();
  return receipt;
}

// buydeitem
export async function buyDeItem(_licenseId, _deItemId, _assetType, price) {
  let contract = getContract();
  let tx = await contract.buyDeItem(_licenseId, _deItemId, _assetType, {
    value: price,
  });
  let receipt = await tx.wait();
  return receipt;
}

// function to get user details
export async function getUserDetails() {
  let contract = getContract();
  let user = await contract.getUserDetails(window.ethereum.selectedAddress);
  return user;
}
// function getDeItemById
export async function getDeItemById(_deItemId, _assetType) {
  let contract = getContract();
  let deItem = await contract.getDeItemById(_deItemId, _assetType);
  return deItem;
}

// function getDeItemsByType
export async function getDeItemsByType(_deItemIds, _assetType) {
  let contract = getContract();
  let deItems = await contract.getDeItemsByType(_deItemIds, _assetType);
  return deItems;
}

// function to get all Atomics
export async function getAllAtomics() {
  let contract = getContract();
  let atomics = await contract.getAllAtomics();
  return atomics;
}
// function to get all Collections
export async function getAllCollections() {
  let contract = getContract();
  let collections = await contract.getAllCollections();
  return collections;
}

// function to get all licences
export async function getAllLicences() {
  let contract = getContract();
  let licences = await contract.getAllLicenses();
  return licences;
}
