// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Depictorial is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _AtomicIds;
    Counters.Counter private _CollectionIds;
    Counters.Counter private _LicenseIds;
    Counters.Counter private _PurchaseIds;
    address owner;
    // platform fee
    uint256 private platformFee = 25;
    uint256 private deno = 1000;
    // asset limit for a collection
    uint256 private assetLimit = 100;
    enum Type {
        Atomic,
        Collection
    }
    enum DeItemType {
        Photo,
        Video,
        Audio,
        Meme
    }
    struct User {
        address payable userAddress;
        uint256[] collectionIds;
        uint256[] atomicIds;
        uint256[] licenseIds;
        uint256[] purchaseIds;
    }

    struct Licecnse {
        uint256 Id;
        address payable Owner;
        uint256 Price;
        uint Duration;
        string metaData;
        // {
        // name
        // description
        // Creation time
        // Expiration time
        // Conditions
        // }
    }

    struct Purchase {
        uint256 Id;
        address payable Buyer;
        uint256 licenseId;
        uint256 DeItemId;
        Type AssetType;
    }
    struct DeItem {
        uint256 Id;
        Type AssetType;
        DeItemType ItemType;
        address payable Owner;
        uint256[] licenseIds;
        string metaData;
        // {
        //     Title
        //     description
        //     Creation time
        //     Expiration time
        //    url:[]
        //     tags:[]
        // }
    }

    mapping(address => User) public users;
    DeItem[] public collections;
    DeItem[] public atomics;
    Licecnse[] public licenses;
    Purchase[] public purchases;

    constructor() {
        owner = msg.sender;
        collections.push(
            DeItem({
                Id: 0,
                AssetType: Type.Collection,
                ItemType: DeItemType.Photo,
                Owner: payable(address(0)),
                licenseIds: new uint256[](0),
                metaData: "Default Collection"
            })
        );
        atomics.push(
            DeItem({
                Id: 0,
                AssetType: Type.Atomic,
                ItemType: DeItemType.Photo,
                Owner: payable(address(0)),
                licenseIds: new uint256[](0),
                metaData: "Default Atomic"
            })
        );
        licenses.push(
            Licecnse({
                Id: 0,
                Owner: payable(address(0)),
                Price: 0,
                Duration: 0,
                metaData: "Default License"
            })
        );
        purchases.push(
            Purchase({
                Id: 0,
                Buyer: payable(address(0)),
                licenseId: 0,
                DeItemId: 0,
                AssetType: Type.Atomic
            })
        );
        registerUser(owner);
        init();
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }
    //  modifier function to check if the user is registered
    modifier isRegistered() {
        require(
            users[msg.sender].userAddress == msg.sender,
            "You are not registered"
        );
        _;
    }

    // function to register a user, from msg.sender, return the user Id
    // function registerUser() public returns (bool) {
    //     if (users[msg.sender].userAddress != address(0)) {
    //         return true;
    //     }
    //     users[msg.sender] = User({
    //         userAddress: payable(msg.sender),
    //         atomicIds: new uint256[](0),
    //         collectionIds: new uint256[](0),
    //         licenseIds: new uint256[](0),
    //         purchaseIds: new uint256[](0)
    //     });
    //     return true;
    // }

    // function to register a user, from msg.sender, return the user Id
    function registerUser(address _addr) public returns (bool) {
        if (users[msg.sender].userAddress != address(0)) {
            return true;
        }
        users[msg.sender] = User({
            userAddress: payable(_addr),
            atomicIds: new uint256[](0),
            collectionIds: new uint256[](0),
            licenseIds: new uint256[](0),
            purchaseIds: new uint256[](0)
        });
        return true;
    }

    // function to check if the user is registered
    function isUserRegistered() public view returns (bool) {
        if (users[msg.sender].userAddress != address(0)) {
            return true;
        }
        return false;
    }

    // function to create a license, return the license Id
    function createLicense(
        uint256 _price,
        uint256 _duration,
        string memory _metaData
    ) public isRegistered returns (uint256) {
        _LicenseIds.increment();
        uint256 newLicenseId = _LicenseIds.current();
        licenses.push(
            Licecnse({
                Id: newLicenseId,
                Owner: payable(msg.sender),
                Price: _price,
                Duration: _duration,
                metaData: _metaData
            })
        );
        users[msg.sender].licenseIds.push(newLicenseId);
        return newLicenseId;
    }

    // function getAllAtomicsByItemType returns all the atomics of a particular ItemType and also return the data of the licenses of the atomics
    // create a struct to return the data of the licenses of the atomics
    struct AtomicLicense {
        uint256 Id;
        address payable Owner;
        uint256 Price;
        uint Duration;
    }
    // create a struct to return the data of the atomics
    struct Atomic {
        uint256 Id;
        DeItemType ItemType;
        address payable Owner;
        string metaData;
        AtomicLicense[] licenses;
    }

    // function to get all the atomics of a particular ItemType
    // function getAllAtomicsByItemType1(
    //     DeItemType _itemType
    // ) public view returns (Atomic[] memory) {
    //     DeItem[] memory _atomics = new DeItem[](atomics.length);
    //     uint256 counter = 0;
    //     for (uint256 i = 0; i < atomics.length; i++) {
    //         if (atomics[i].ItemType == _itemType) {
    //             _atomics[counter] = atomics[i];
    //             counter++;
    //         }
    //     }
    //     Atomic[] memory _atomicsWithLicense = new Atomic[](counter);
    //     for (uint256 i = 0; i < counter; i++) {
    //         _atomicsWithLicense[i].Id = _atomics[i].Id;
    //         _atomicsWithLicense[i].ItemType = _atomics[i].ItemType;
    //         _atomicsWithLicense[i].Owner = _atomics[i].Owner;
    //         _atomicsWithLicense[i].metaData = _atomics[i].metaData;
    //         _atomicsWithLicense[i].licenses = new AtomicLicense[](
    //             _atomics[i].licenseIds.length
    //         );
    //         for (uint256 j = 0; j < _atomics[i].licenseIds.length; j++) {
    //             _atomicsWithLicense[i].licenses[j].Id = licenses[
    //                 _atomics[i].licenseIds[j]
    //             ].Id;
    //             _atomicsWithLicense[i].licenses[j].Owner = licenses[
    //                 _atomics[i].licenseIds[j]
    //             ].Owner;
    //             _atomicsWithLicense[i].licenses[j].Price = licenses[
    //                 _atomics[i].licenseIds[j]
    //             ].Price;
    //             _atomicsWithLicense[i].licenses[j].Duration = licenses[
    //                 _atomics[i].licenseIds[j]
    //             ].Duration;
    //         }
    //     }
    //     return _atomicsWithLicense;
    // }

    function getAllAtomicsByItemType(
        DeItemType _itemType
    ) public view returns (DeItem[] memory) {
        DeItem[] memory _atomics = new DeItem[](atomics.length);
        uint256 counter = 0;
        for (uint256 i = 0; i < atomics.length; i++) {
            if (atomics[i].ItemType == _itemType) {
                _atomics[counter] = atomics[i];
                counter++;
            }
        }
        return _atomics;
    }

    // getAllAtomicByType
    // getAllCollectionsByType

    function getAllCollectionsByItemType(
        DeItemType _itemType
    ) public view returns (DeItem[] memory) {
        DeItem[] memory _collections = new DeItem[](collections.length);
        uint256 counter = 0;
        for (uint256 i = 0; i < collections.length; i++) {
            if (collections[i].ItemType == _itemType) {
                _collections[counter] = collections[i];
                counter++;
            }
        }
        return _collections;
    }

    // function to create a DeItem given the assetType , ItemType,licenseIds , metaData and store it in the user struct as well and return the DeItem Id
    function createDeItem(
        Type _assetType,
        DeItemType _itemType,
        uint256[] memory _licenseIds,
        string memory _metaData
    ) public isRegistered returns (uint256) {
        if (_assetType == Type.Atomic) {
            _AtomicIds.increment();
            uint256 newAtomicId = _AtomicIds.current();
            atomics.push(
                DeItem({
                    Id: newAtomicId,
                    AssetType: _assetType,
                    ItemType: _itemType,
                    Owner: payable(msg.sender),
                    licenseIds: _licenseIds,
                    metaData: _metaData
                })
            );
            users[msg.sender].atomicIds.push(newAtomicId);
            return newAtomicId;
        } else {
            _CollectionIds.increment();
            uint256 newCollectionId = _CollectionIds.current();
            collections.push(
                DeItem({
                    Id: newCollectionId,
                    AssetType: _assetType,
                    ItemType: _itemType,
                    Owner: payable(msg.sender),
                    licenseIds: _licenseIds,
                    metaData: _metaData
                })
            );
            users[msg.sender].collectionIds.push(newCollectionId);
            return newCollectionId;
        }
    }

    // function to buy a DeItem given the licenseId , DeItemId and assetType
    function buyDeItem(
        uint256 _licenseId,
        uint256 _deItemId,
        Type _assetType
    ) public payable isRegistered returns (uint256) {
        require(
            licenses[_licenseId].Owner != address(0),
            "License does not exist"
        );
        // require(
        //     licenses[_licenseId].Price == msg.value,
        //     "Price does not match"
        // );
        require(
            licenses[_licenseId].Owner != msg.sender,
            "You are the owner of the license"
        );
        if (_assetType == Type.Atomic) {
            require(
                atomics[_deItemId].Owner != address(0),
                "Atomic does not exist"
            );
            require(
                atomics[_deItemId].Owner != msg.sender,
                "You are the owner of the Atomic"
            );
            atomics[_deItemId].Owner.transfer(msg.value);
            // atomics[_deItemId].Owner = payable(msg.sender);
        } else {
            require(
                collections[_deItemId].Owner != address(0),
                "Collection does not exist"
            );
            require(
                collections[_deItemId].Owner != msg.sender,
                "You are the owner of the Collection"
            );
            collections[_deItemId].Owner.transfer(msg.value);
            // collections[_deItemId].Owner = payable(msg.sender);
        }
        _PurchaseIds.increment();
        uint256 newPurchaseId = _PurchaseIds.current();
        purchases.push(
            Purchase({
                Id: newPurchaseId,
                Buyer: payable(msg.sender),
                licenseId: _licenseId,
                DeItemId: _deItemId,
                AssetType: _assetType
            })
        );
        // Also create a ERC721 token for the purchase and transfer it to the buyer address and store the token id in the purchase struct as well
        // create a ERC721Token
        users[msg.sender].purchaseIds.push(newPurchaseId);
        return newPurchaseId;
    }

    // function to get the atomic details and the license details and the collection details and the purchase details , given the user address
    function getUserDetails(
        address _addr
    )
        public
        view
        returns (
            DeItem[] memory atomicDetails,
            DeItem[] memory collectionDetails,
            Licecnse[] memory licenseDetails,
            Purchase[] memory purchaseDetails
        )
    {
        return (
            getDeItems(users[_addr].atomicIds, Type.Atomic),
            getDeItems(users[_addr].collectionIds, Type.Collection),
            getLicenses(users[_addr].licenseIds),
            getPurchases(users[_addr].purchaseIds)
        );
    }

    //function getDeItemById (uint256 _deItemId, Type _assetType) which returns the DeItem details and the license details and the purchase details , given the DeItemId and assetType
    function getDeItemById(
        uint256 _deItemId,
        Type _assetType
    )
        public
        view
        returns (
            DeItem memory deItemDetails,
            Licecnse[] memory licenseDetails,
            Purchase[] memory purchaseDetails
        )
    {
        if (_assetType == Type.Atomic) {
            return (
                atomics[_deItemId],
                getLicenses(atomics[_deItemId].licenseIds),
                getPurchasesByDeItemId(_deItemId, _assetType)
            );
        } else {
            return (
                collections[_deItemId],
                getLicenses(collections[_deItemId].licenseIds),
                getPurchasesByDeItemId(_deItemId, _assetType)
            );
        }
    }

    // getPurchasesByDeItemId
    function getPurchasesByDeItemId(
        uint256 _deItemId,
        Type _assetType
    ) internal view returns (Purchase[] memory) {
        Purchase[] memory _purchases = new Purchase[](purchases.length);
        uint256 counter = 0;
        for (uint256 i = 0; i < purchases.length; i++) {
            if (
                purchases[i].DeItemId == _deItemId &&
                purchases[i].AssetType == _assetType
            ) {
                _purchases[counter] = purchases[i];
                counter++;
            }
        }
        return _purchases;
    }

    function getDeItems(
        uint256[] memory _deItemIds,
        Type _assetType
    ) internal view returns (DeItem[] memory DeItems) {
        if (_assetType == Type.Atomic) {
            return getDeItemsByType(_deItemIds, Type.Atomic);
        } else {
            return getDeItemsByType(_deItemIds, Type.Collection);
        }
    }

    // given an array of licenseIds, return the array of licenses
    function getLicenses(
        uint256[] memory _licenseIds
    ) internal view returns (Licecnse[] memory Licenses) {
        Licecnse[] memory _licenses = new Licecnse[](_licenseIds.length);
        for (uint256 i = 0; i < _licenseIds.length; i++) {
            _licenses[i] = licenses[_licenseIds[i]];
        }
        return _licenses;
    }

    function getPurchases(
        uint256[] memory _purchaseIds
    ) internal view returns (Purchase[] memory Purchases) {
        Purchase[] memory _purchases = new Purchase[](_purchaseIds.length);
        for (uint256 i = 0; i < _purchaseIds.length; i++) {
            _purchases[i] = purchases[_purchaseIds[i]];
        }
        return _purchases;
    }

    // given an array of DeItemIds and DeItemType, return the array of DeItems

    function getDeItemsByType(
        uint256[] memory _deItemIds,
        Type _assetType
    ) public view returns (DeItem[] memory DeItems) {
        DeItem[] memory _deItems = new DeItem[](_deItemIds.length);
        if (_assetType == Type.Atomic) {
            for (uint256 i = 0; i < _deItemIds.length; i++) {
                _deItems[i] = atomics[_deItemIds[i]];
            }
        } else {
            for (uint256 i = 0; i < _deItemIds.length; i++) {
                _deItems[i] = collections[_deItemIds[i]];
            }
        }
        return _deItems;
    }

    // init function with 1 user of the owner and 5 licenses  and 5 atomics and 5 collections , use the functions already created to create the items
    function init() public onlyOwner {
        // import block.timestamp
        uint256 timestamp = block.timestamp;

        // make a array of 5 licenseIds
        uint256[] memory licenseIds = new uint256[](5);
        // init the array with the licenseIds
        // for (uint256 i = 0; i < 5; i++) {
        //     licenseIds[i] = i + 1;
        // }
        //     createLicense(
        //         (1) * 1000000000000000000,
        //         timestamp + (1 * 10 days),
        //         '{"name":"Standard License","description":"Licence with standard perks","licenceType":"Paid"}'
        //     );

        //     createLicense(
        //         (2) * 1000000000000000000,
        //         timestamp + (1 * 20 days),
        //         '{"name":"Preminum Licence","description":" License with Premium Perks ","licenceType":"Paid"}'
        //     );

        //     createLicense(
        //         (3) * 1000000000000000000,
        //         timestamp + (1 * 30 days),
        //         '{"name":"Exclusive Licence","description":" License with Exclusive Perks ","licenceType":"Paid"}'
        //     );
        //     createLicense(
        //         (4) * 1000000000000000000,
        //         timestamp + (1 * 60 days),
        //         '{"name":"VIP Licence","description":" License with VIP Perks ","licenceType":"Paid"}'
        //     );
        // }
    }

    // get all atomics in the platform
    function getAllAtomics() public view returns (DeItem[] memory) {
        return atomics;
    }

    // get all collections in the platform

    function getAllCollections() public view returns (DeItem[] memory) {
        return collections;
    }

    // get all licenses in the platform
    function getAllLicenses() public view returns (Licecnse[] memory) {
        return licenses;
    }

    //owner can withdraw the funds
    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // self destruct function to destroy the contract
    function destroy() public onlyOwner {
        selfdestruct(payable(owner));
    }
}
