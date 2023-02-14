// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Depictorialv4 is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _MediaIds;
    Counters.Counter private _CollectionIds;
    Counters.Counter private _LicenseIds;
    address owner;
    // platform fee
    uint256 private platformFee = 25;
    uint256 private deno = 1000;
    // asset limit for a collection
    uint256 private assetLimit = 100;
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

    struct DeItem {
        Type ItemType;
        uint256 Id;
        Type AssetType;
        uint256[] AssetIds;
        address payable Owner;
        uint256 Price;
        string metaData;
        // {
        //     name
        //     desciption
        //     tags
        //     image
        //     video
        // }
    }
    mapping(address => User) public users;
    DeItem[] public collections;
    DeItem[] public medias;
    DeItem[] public licenses;

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
        // fill the first index of the collections with a dummy value
        collections.push(
            DeItem({
                ItemType: Type.Collection,
                Id: 0,
                AssetType: Type.Media,
                AssetIds: new uint256[](0),
                Owner: payable(address(0)),
                Price: 0,
                metaData: ""
            })
        );
        // fill the first index of the medias with a dummy value
        medias.push(
            DeItem({
                ItemType: Type.Media,
                Id: 0,
                AssetType: Type.Media,
                AssetIds: new uint256[](0),
                Owner: payable(address(0)),
                Price: 0,
                metaData: ""
            })
        );
        // fill the first index of the licenses with a dummy value
        licenses.push(
            DeItem({
                ItemType: Type.License,
                Id: 0,
                AssetType: Type.Media,
                AssetIds: new uint256[](0),
                Owner: payable(address(0)),
                Price: 0,
                metaData: ""
            })
        );

        registerUser();
    }

    // function to create a media where media is a NFT and it will also be be stored in the medias mapping, and the media will be pushed to the user's media array and the media Id will be incremented by 1 for the next media and the Id will be returned
    function createMedia(
        uint256 price,
        string memory metaData
    ) public isRegistered returns (uint256) {
        // make media limit of user 10
        require(
            users[msg.sender].mediaIds.length <= 100,
            "Media limit exceeded"
        );
        _MediaIds.increment();
        uint256 mediaId = _MediaIds.current();
        medias.push(
            DeItem({
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
            users[msg.sender].collectionIds.length <= 100,
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
            DeItem({
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
        // make asset limit of license 10
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
            DeItem({
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
    function getMedias() public view returns (DeItem[] memory) {
        return medias;
    }

    // get all collections in the marketplace
    function getCollections() public view returns (DeItem[] memory) {
        return collections;
    }

    // get all licenses in the marketplace
    function getLicenses() public view returns (DeItem[] memory) {
        return licenses;
    }

    // given the asset type and array of asset Ids, get the assets details
    function getAssetsDetails(
        Type assetType,
        uint256[] memory assetIds
    ) public view returns (DeItem[] memory) {
        // check asset type
        require(
            assetType == Type.Media ||
                assetType == Type.Collection ||
                assetType == Type.License,
            "Asset type is not valid"
        );
        // check asset Ids
        for (uint256 i = 0; i < assetIds.length; i++) {
            require(
                (assetType == Type.Media && assetIds[i] <= medias.length) ||
                    (assetType == Type.Collection &&
                        assetIds[i] <= collections.length) ||
                    (assetType == Type.License &&
                        assetIds[i] <= licenses.length),
                "Asset Id is not valid"
            );
        }

        DeItem[] memory assets = new DeItem[](assetIds.length);
        for (uint256 i = 0; i < assetIds.length; i++) {
            if (assetType == Type.Media) {
                assets[i] = medias[assetIds[i]];
            } else if (assetType == Type.Collection) {
                assets[i] = collections[assetIds[i]];
            } else {
                assets[i] = licenses[assetIds[i]];
            }
        }
        return assets;
    }

    // given the address and type of the asset, get all the asset details of the user
    function getUserAssetsByType(
        address userAddress,
        Type assetType
    ) public view isRegistered returns (DeItem[] memory) {
        // check asset type
        require(
            assetType == Type.Media ||
                assetType == Type.Collection ||
                assetType == Type.License,
            "Asset type is not valid"
        );
        // more error handling
        require(
            (assetType == Type.Media &&
                users[userAddress].mediaIds.length > 0) ||
                (assetType == Type.Collection &&
                    users[userAddress].collectionIds.length > 0) ||
                (assetType == Type.License &&
                    users[userAddress].licenseIds.length > 0),
            "User has no assets of this type"
        );

        DeItem[] memory userAssets;
        if (assetType == Type.Media) {
            userAssets = new DeItem[](users[userAddress].mediaIds.length);
            for (uint256 i = 0; i < users[userAddress].mediaIds.length; i++) {
                userAssets[i] = medias[users[userAddress].mediaIds[i]];
            }
        } else if (assetType == Type.Collection) {
            userAssets = new DeItem[](users[userAddress].collectionIds.length);
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
            userAssets = new DeItem[](users[userAddress].licenseIds.length);
            for (uint256 i = 0; i < users[userAddress].licenseIds.length; i++) {
                userAssets[i] = licenses[users[userAddress].licenseIds[i]];
            }
        }
        return userAssets;
    }

    // given the address, get all the purchased assets details of the user from the purchaseIds array and look into the licenses mapping to get the details of the license
    function getUserPurchasedAssets(
        address userAddress
    ) public view isRegistered returns (DeItem[] memory) {
        require(
            (users[userAddress].purchaseIds.length > 0),
            "User has no assets of this type"
        );
        DeItem[] memory userAssets;
        userAssets = new DeItem[](users[userAddress].purchaseIds.length);
        for (uint256 i = 0; i < users[userAddress].purchaseIds.length; i++) {
            userAssets[i] = licenses[users[userAddress].purchaseIds[i]];
        }
        return userAssets;
    }

    function transferEther(address payable recipient, uint256 amount) internal {
        require(msg.sender.balance >= amount, "Insufficient balance");
        recipient.transfer(amount);
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
        // make sure the user is not the owner of the license
        require(
            licenses[licenseId].Owner != msg.sender,
            "You are the owner of this license"
        );
        // transfer the ownership of the license to the buyer
        // licenses[licenseId].Owner = payable(msg.sender);

        // transfer the price to the owner of the license
        // payable(licenses[licenseId].Owner).transfer(_price);

        transferEther(payable(licenses[licenseId].Owner), _price);

        // add the license to the buyer's license array
        users[msg.sender].purchaseIds.push(licenseId);
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

    // function to register a user, from msg.sender, return the user Id
    function registerUser(address _addr) public onlyOwner returns (bool) {
        if (users[msg.sender].userAddress != address(0)) {
            return true;
        }
        users[msg.sender] = User({
            userAddress: payable(_addr),
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
