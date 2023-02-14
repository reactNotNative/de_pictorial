// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Depictorial is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _MediaIds;
    Counters.Counter private _CollectionIds;
    Counters.Counter private _LicenseIds;
    address owner;
    // platform fee
    uint256 private platformFee = 25;
    uint256 private deno = 1000;
    // asset limit for a collection
    uint256 private assetLimit = 10;
    enum Type {
        Media,
        Collection,
        License
    }

    struct User {
        address payable userAddress;
        uint256[] collectionIds;
        uint256[] mediaIds;
        uint256[] licenseIds;
        uint256[] purchaseIds;
    }

    struct MarketplaceItem {
        Type ItemType;
        uint256 Id;
        Type AssetType;
        uint256[] AssetIds;
        address payable Owner;
        uint256 Price;
        string metaData;
    }
    mapping(address => User) public users;
    MarketplaceItem[] public collections;
    MarketplaceItem[] public medias;
    MarketplaceItem[] public licenses;

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }
    // modifier function to check if the user is the owner of the media
    modifier onlyMediaOwner(uint256 mediaId) {
        require(
            medias[mediaId].Owner == msg.sender,
            "You are not the owner of this media"
        );
        _;
    }
    // modifier function to check if the user is the owner of the collection
    modifier onlyCollectionOwner(uint256 collectionId) {
        require(
            collections[collectionId].Owner == msg.sender,
            "You are not the owner of this collection"
        );
        _;
    }
    // modifier function to check if the user is the owner of the license
    modifier onlyLicenseOwner(uint256 licenseId) {
        require(
            licenses[licenseId].Owner == msg.sender,
            "You are not the owner of this license"
        );
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

    constructor() {
        owner = msg.sender;
        registerUser();
    }

    // function to create a media where media is a NFT and it will also be be stored in the medias mapping, and the media will be pushed to the user's media array and the media Id will be incremented by 1 for the next media and the Id will be returned
    function createMedia(
        uint256 price,
        string memory metaData
    ) public isRegistered returns (uint256) {
        // make media limit of user 10
        require(
            users[msg.sender].mediaIds.length <= 10,
            "Media limit exceeded"
        );
        _MediaIds.increment();
        uint256 mediaId = _MediaIds.current();
        medias.push(
            MarketplaceItem({
                ItemType: Type.Media,
                Id: mediaId,
                AssetType: Type.Media,
                AssetIds: new uint256[](0),
                Owner: payable(msg.sender),
                Price: price,
                metaData: metaData
            })
        );
        users[msg.sender].mediaIds.push(mediaId);
        return mediaId;
    }

    // function to create a collection where collection is a NFT and it will also be be stored in the collections mapping, and the collection will be pushed to the user's collection array and the collection Id will be incremented by 1 for the next collection and the Id will be returned
    function createCollection(
        uint256[] memory assetIds,
        uint256 price,
        string memory metaData
    ) public isRegistered returns (uint256) {
        // make collection limit of user 10
        require(
            users[msg.sender].collectionIds.length <= 10,
            "Collection limit exceeded"
        );
        require(
            assetIds.length <= assetLimit,
            "Asset limit exceeded for a collection"
        );
        // check if the asset Ids are valid && check if the user is the owner of the assets
        for (uint256 i = 0; i < assetIds.length; i++) {
            require(
                assetIds[i] >= 0 && assetIds[i] <= medias.length,
                "Asset Id is not valid"
            );

            require(
                medias[assetIds[i]].Owner == msg.sender,
                "You are not the owner of this media"
            );
        }

        _CollectionIds.increment();
        uint256 collectionId = _CollectionIds.current();
        collections.push(
            MarketplaceItem({
                ItemType: Type.Collection,
                Id: collectionId,
                AssetType: Type.Media,
                AssetIds: assetIds,
                Owner: payable(msg.sender),
                Price: price,
                metaData: metaData
            })
        );
        users[msg.sender].collectionIds.push(collectionId);
        return collectionId;
    }

    // function to create a license, Take asset Type as Input where license is a NFT and it will also be be stored in the licenses mapping, and the license will be pushed to the user's license array and the license Id will be incremented by 1 for the next license and the Id will be returned
    function createLicense(
        uint256[] memory assetIds,
        Type assetType,
        uint256 price,
        string memory metaData
    ) public isRegistered returns (uint256) {
        // make license limit of user 10
        require(
            users[msg.sender].licenseIds.length <= 10,
            "License limit exceeded"
        );
        require(
            assetIds.length <= assetLimit,
            "Asset limit exceeded for a license"
        );
        // check if the asset Ids are valid && check if the user is the owner of the assets
        for (uint256 i = 0; i < assetIds.length; i++) {
            require(
                (assetIds[i] >= 0 &&
                    (assetType == Type.Collection &&
                        assetIds[i] <= collections.length)) ||
                    (assetType == Type.Media && assetIds[i] <= medias.length),
                "Asset Id is not valid"
            );

            require(
                // based on the asset type, check if the user is the owner of the asset
                (assetType == Type.Collection &&
                    collections[assetIds[i]].Owner == msg.sender) ||
                    (assetType == Type.Media &&
                        medias[assetIds[i]].Owner == msg.sender),
                "You are not the owner of this asset"
            );
        }

        _LicenseIds.increment();
        uint256 licenseId = _LicenseIds.current();
        licenses.push(
            MarketplaceItem({
                ItemType: Type.License,
                Id: licenseId,
                AssetType: assetType,
                AssetIds: assetIds,
                Owner: payable(msg.sender),
                Price: price,
                metaData: metaData
            })
        );
        users[msg.sender].licenseIds.push(licenseId);
        return licenseId;
    }

    // get all medias in the marketplace
    function getMedias() public view returns (MarketplaceItem[] memory) {
        return medias;
    }

    // get all collections in the marketplace
    function getCollections() public view returns (MarketplaceItem[] memory) {
        return collections;
    }

    // get all licenses in the marketplace
    function getLicenses() public view returns (MarketplaceItem[] memory) {
        return licenses;
    }

    // TODO: get all assets of a user
    // given the address and type of the asset, get all the asset details of the user
    function getUserAssetsByType(
        address userAddress,
        Type assetType
    ) public view returns (MarketplaceItem[] memory) {
        MarketplaceItem[] memory userAssets;
        if (assetType == Type.Media) {
            userAssets = new MarketplaceItem[](
                users[userAddress].mediaIds.length
            );
            for (uint256 i = 0; i < users[userAddress].mediaIds.length; i++) {
                userAssets[i] = medias[users[userAddress].mediaIds[i]];
            }
        } else if (assetType == Type.Collection) {
            userAssets = new MarketplaceItem[](
                users[userAddress].collectionIds.length
            );
            for (
                uint256 i = 0;
                i < users[userAddress].collectionIds.length;
                i++
            ) {
                userAssets[i] = collections[
                    users[userAddress].collectionIds[i]
                ];
            }
        } else if (assetType == Type.License) {
            userAssets = new MarketplaceItem[](
                users[userAddress].licenseIds.length
            );
            for (uint256 i = 0; i < users[userAddress].licenseIds.length; i++) {
                userAssets[i] = licenses[users[userAddress].licenseIds[i]];
            }
        }
        return userAssets;
    }

    // function to buy a license of a asset given the license Id, but before buying the license, the user must be registered and the license Id must be valid and the user must pay the correct price, but the ownership will be transferred to the buyer and the license will be added to the buyer's license array
    function buyLicense(
        uint256 licenseId,
        uint256 _price
    ) public payable isRegistered returns (bool) {
        require(
            licenseId >= 0 && licenseId <= licenses.length,
            "License Id is not valid"
        );
        require(
            _price == licenses[licenseId].Price,
            "Please pay the correct price"
        );

        // transfer the license to the buyer with proper checks
        address buyer = msg.sender;
        address seller = licenses[licenseId].Owner;
        uint256 price = _price;
        uint256 gasLeft = gasleft();
        bool transferSuccess;

        // Use the low-level call to prevent reentrancy attacks
        // Also store the success value and return data
        assembly {
            let x := call(gasLeft, seller, price, 0, 0, 0, 0)
            transferSuccess := eq(x, 0)
        }

        require(transferSuccess, "Transfer failed");

        // add the license to the buyer's license array
        users[buyer].purchaseIds.push(licenseId);
        return true;
    }

    // function to register a user, from msg.sender, return the user Id
    function registerUser() public returns (bool) {
        if (users[msg.sender].userAddress != address(0)) {
            return true;
        }
        users[msg.sender] = User({
            userAddress: payable(msg.sender),
            mediaIds: new uint256[](0),
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

    // function to update metadata of a media, collection or license
    function updateMetaData(
        uint256 assetId,
        Type assetType,
        string memory metaData
    ) public isRegistered returns (bool) {
        require(
            (assetId >= 0 &&
                (assetType == Type.Collection &&
                    assetId <= collections.length)) ||
                (assetType == Type.Media && assetId <= medias.length) ||
                (assetType == Type.License && assetId <= licenses.length),
            "Asset Id is not valid"
        );

        require(
            // based on the asset type, check if the user is the owner of the asset
            (assetType == Type.Collection &&
                collections[assetId].Owner == msg.sender) ||
                (assetType == Type.Media &&
                    medias[assetId].Owner == msg.sender) ||
                (assetType == Type.License &&
                    licenses[assetId].Owner == msg.sender),
            "You are not the owner of this asset"
        );

        if (assetType == Type.Media) {
            medias[assetId].metaData = metaData;
        } else if (assetType == Type.Collection) {
            collections[assetId].metaData = metaData;
        } else if (assetType == Type.License) {
            licenses[assetId].metaData = metaData;
        }
        return true;
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
