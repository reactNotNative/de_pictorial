// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Marketplace is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _nftSold;
    IERC1155 private nftContract;
    address private owner;
    uint256 private platformFee = 25;
    uint256 private deno = 1000;

    constructor() ERC1155("") {}

    enum Type {
        Collection,
        Media
    }

    struct Media {
        string mediaName;
        uint256 mediaId;
        address payable mediaOwner;
        address mediaAddress;
        uint256 mediaPrice;
        string metaData;
    }

    struct Collection {
        address collectionAddress;
        string collectionName;
        address payable collectionOwner;
        string collectionDescription;
        string collectionImage;
        string collectionUrl;
        uint256 collectionId;
        uint256 collectionRoyalty;
        uint256 collectionAmount;
        uint256[] mediaIds;
    }

    struct User {
        address payable userAddress;
        uint256[] collectionIds;
        uint256[] mediaIds;
        uint256[] licenseIds;
        uint256[] purchaseIds;
    }

    struct License {
        Type licenseType;
        uint256 licenseId;
        string licenseName;
        address licenseAddress;
        uint256 licenseAssetId;
        address licenseAssetAddress;
        address payable licenseOwner;
        string licenseDescription;
        string licenseImage;
        string licenseUrl;
        uint256 licensePrice;
        string metaData;
    }

    mapping(address => User) public users;
    // User[] public users;
    Collection[] public collections;
    Media[] public medias;
    License[] public licenses;

    // function to create a media where media is a NFT and it will also be be stored in the media mapping, and the media will be pushed to the user's media array and the media Id will be incremented by 1 for the next media and the Id will be returned
    function createMedia(
        string memory _mediaName,
        address _mediaAddress,
        uint256 _mediaPrice,
        string memory _metaData
    ) public returns (uint256) {
        // check if the media name is not empty
        require(bytes(_mediaName).length > 0, "Media name cannot be empty");
        // check if the media address is not empty
        require(_mediaAddress != address(0), "Media address cannot be empty");
        // check if the media price is not empty
        require(_mediaPrice > 0, "Media price cannot be empty");
        // check if the media metadata is not empty
        require(bytes(_metaData).length > 0, "Media metadata cannot be empty");
        // check if the sender is a user
        require(
            users[msg.sender].userAddress != address(0),
            "You are not a user"
        );
        // increment the media Id
        _tokenIds.increment();
        uint256 newMediaId = _tokenIds.current();
        medias.push(
            Media(
                _mediaName,
                newMediaId,
                payable(msg.sender),
                _mediaAddress,
                _mediaPrice,
                _metaData
            )
        );
        // push the media Id to the user's media array
        users[msg.sender].mediaIds.push(newMediaId);
        return newMediaId;
    }

    // function to create a collection where collection is a NFT and it will also be be stored in the collection mapping, and the collection will be pushed to the user's collection array and the collection Id will be incremented by 1 for the next collection and the Id will be returned
    function createCollection(
        address _collectionAddress,
        string memory _collectionName,
        string memory _collectionDescription,
        string memory _collectionImage,
        string memory _collectionUrl,
        uint256 _collectionRoyalty,
        uint256 _collectionAmount
    ) public returns (uint256) {
        // check if the collection name is not empty
        require(
            bytes(_collectionName).length > 0,
            "Collection name cannot be empty"
        );
        // check if the collection address is not empty
        require(
            _collectionAddress != address(0),
            "Collection address cannot be empty"
        );
        // check if the collection description is not empty
        require(
            bytes(_collectionDescription).length > 0,
            "Collection description cannot be empty"
        );
        // check if the collection image is not empty
        require(
            bytes(_collectionImage).length > 0,
            "Collection image cannot be empty"
        );
        // check if the collection url is not empty
        require(
            bytes(_collectionUrl).length > 0,
            "Collection url cannot be empty"
        );
        // check if the collection royalty is not empty
        require(_collectionRoyalty > 0, "Collection royalty cannot be empty");
        // check if the collection amount is not empty
        require(_collectionAmount > 0, "Collection amount cannot be empty");
        // check if the sender is a user
        require(
            users[msg.sender].userAddress != address(0),
            "You are not a user"
        );
        // increment the collection Id
        _tokenIds.increment();
        uint256 newCollectionId = _tokenIds.current();
        collections.push(
            Collection(
                _collectionAddress,
                _collectionName,
                payable(msg.sender),
                _collectionDescription,
                _collectionImage,
                _collectionUrl,
                newCollectionId,
                _collectionRoyalty,
                _collectionAmount,
                new uint256[](0)
            )
        );
        // push the collection Id to the user's collection array
        users[msg.sender].collectionIds.push(newCollectionId);
        return newCollectionId;
    }

    // function to create a license with optional paramaters where license is a NFT and it will also be be stored in the license mapping, and the license will be pushed to the user's license array and the license Id will be incremented by 1 for the next license and the Id will be returned
    function createLicense(
        Type _licenseType,
        string memory _licenseName,
        address _licenseAddress,
        uint256 _licenseAssetId,
        address _licenseAssetAddress,
        string memory _licenseDescription,
        string memory _licenseImage,
        string memory _licenseUrl,
        uint256 _licensePrice,
        string memory _metaData
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newLicenseId = _tokenIds.current();
        licenses.push(
            License(
                _licenseType,
                newLicenseId,
                _licenseName,
                _licenseAddress,
                _licenseAssetId,
                _licenseAssetAddress,
                payable(msg.sender),
                _licenseDescription,
                _licenseImage,
                _licenseUrl,
                _licensePrice,
                _metaData
            )
        );
        return newLicenseId;
    }

    // function to get the media details by passing the media Id
    function getMedia(
        uint256 _mediaId
    )
        public
        view
        returns (
            string memory,
            uint256,
            address,
            address,
            uint256,
            string memory
        )
    {
        return (
            medias[_mediaId].mediaName,
            medias[_mediaId].mediaId,
            medias[_mediaId].mediaOwner,
            medias[_mediaId].mediaAddress,
            medias[_mediaId].mediaPrice,
            medias[_mediaId].metaData
        );
    }

    // function to get the collection details by passing the collection Id
    function getCollection(
        uint256 _collectionId
    )
        public
        view
        returns (
            address,
            string memory,
            address,
            string memory,
            string memory,
            string memory,
            uint256
        )
    {
        return (
            collections[_collectionId].collectionAddress,
            collections[_collectionId].collectionName,
            collections[_collectionId].collectionOwner,
            collections[_collectionId].collectionDescription,
            collections[_collectionId].collectionImage,
            collections[_collectionId].collectionUrl,
            collections[_collectionId].collectionAmount
        );
    }

    // function to return mediaIds of a collection
    function getMediaIdsOfCollecion(
        uint256 _collectionId
    ) public view returns (uint256[] memory) {
        return collections[_collectionId].mediaIds;
    }

    // function to get the license details by passing the license Id use less gas

    function getLicense(
        uint256 _licenseId
    )
        public
        view
        returns (Type, string memory, address, uint256, address, string memory)
    {
        return (
            licenses[_licenseId].licenseType,
            licenses[_licenseId].licenseName,
            licenses[_licenseId].licenseAddress,
            licenses[_licenseId].licenseAssetId,
            licenses[_licenseId].licenseOwner,
            licenses[_licenseId].licenseDescription
        );
    }

    // function to get only licenceImage , licenceUrl and licencePrice and metaData
    function getLicenseImage(
        uint256 _licenseId
    )
        public
        view
        returns (string memory, string memory, uint256, string memory)
    {
        return (
            licenses[_licenseId].licenseImage,
            licenses[_licenseId].licenseUrl,
            licenses[_licenseId].licensePrice,
            licenses[_licenseId].metaData
        );
    }

    // function to get the user details by passing the user address
    function getUser(
        address _userAddress
    )
        public
        view
        returns (address, uint256[] memory, uint256[] memory, uint256[] memory)
    {
        return (
            users[_userAddress].userAddress,
            users[_userAddress].collectionIds,
            users[_userAddress].mediaIds,
            users[_userAddress].licenseIds
        );
    }

    // function to register a new user and it will also be stored in the user mapping
    function registerUser(address _addr) public payable {
        users[msg.sender] = User(
            payable(_addr),
            new uint256[](0),
            new uint256[](0),
            new uint256[](0),
            new uint256[](0)
        );
    }

    // given an array of media Ids, it will return the media details
    function getMediaDetails(
        uint256[] memory _mediaIds
    )
        public
        view
        returns (
            string[] memory,
            uint256[] memory,
            address[] memory,
            address[] memory,
            uint256[] memory,
            string[] memory
        )
    {
        string[] memory mediaNames = new string[](_mediaIds.length);
        uint256[] memory mediaIds = new uint256[](_mediaIds.length);
        address[] memory mediaOwners = new address[](_mediaIds.length);
        address[] memory mediaAddresses = new address[](_mediaIds.length);
        uint256[] memory mediaPrices = new uint256[](_mediaIds.length);
        string[] memory metaData = new string[](_mediaIds.length);
        for (uint256 i = 0; i < _mediaIds.length; i++) {
            mediaNames[i] = medias[_mediaIds[i]].mediaName;
            mediaIds[i] = medias[_mediaIds[i]].mediaId;
            mediaOwners[i] = medias[_mediaIds[i]].mediaOwner;
            mediaAddresses[i] = medias[_mediaIds[i]].mediaAddress;
            mediaPrices[i] = medias[_mediaIds[i]].mediaPrice;
            metaData[i] = medias[_mediaIds[i]].metaData;
        }
        return (
            mediaNames,
            mediaIds,
            mediaOwners,
            mediaAddresses,
            mediaPrices,
            metaData
        );
    }

    // given an array of collection Ids, it will return the collection details
    function getCollectionDetails(
        uint256[] memory _collectionIds
    )
        public
        view
        returns (
            address[] memory,
            string[] memory,
            address[] memory,
            // string[] memory,
            string[] memory,
            string[] memory,
            uint256[] memory
        )
    {
        address[] memory collectionAddresses = new address[](
            _collectionIds.length
        );
        string[] memory collectionNames = new string[](_collectionIds.length);
        address[] memory collectionOwners = new address[](
            _collectionIds.length
        );
        string[] memory collectionDescriptions = new string[](
            _collectionIds.length
        );
        // string[] memory collectionImages = new string[](_collectionIds.length);
        string[] memory collectionUrls = new string[](_collectionIds.length);
        uint256[] memory collectionAmounts = new uint256[](
            _collectionIds.length
        );
        for (uint256 i = 0; i < _collectionIds.length; i++) {
            collectionAddresses[i] = collections[_collectionIds[i]]
                .collectionAddress;
            collectionNames[i] = collections[_collectionIds[i]].collectionName;
            collectionOwners[i] = collections[_collectionIds[i]]
                .collectionOwner;
            collectionDescriptions[i] = collections[_collectionIds[i]]
                .collectionDescription;
            // collectionImages[i] = collections[_collectionIds[i]]
            //     .collectionImage;
            collectionUrls[i] = collections[_collectionIds[i]].collectionUrl;
            collectionAmounts[i] = collections[_collectionIds[i]]
                .collectionAmount;
        }
        return (
            collectionAddresses,
            collectionNames,
            collectionOwners,
            collectionDescriptions,
            // collectionImages,
            collectionUrls,
            collectionAmounts
        );
    }

    // function to get collection images
    function getCollectionImages(
        uint256[] memory _collectionIds
    ) public view returns (string[] memory) {
        string[] memory collectionImages = new string[](_collectionIds.length);
        for (uint256 i = 0; i < _collectionIds.length; i++) {
            collectionImages[i] = collections[_collectionIds[i]]
                .collectionImage;
        }
        return collectionImages;
    }

    // function to buy a licence
    function buyLicense(uint256 _licenseId) public payable {
        require(
            msg.value == licenses[_licenseId].licensePrice,
            "Please pay the correct amount"
        );
        // check if license id is already present in the user's licenseIds array
        for (uint256 i = 0; i < users[msg.sender].licenseIds.length; i++) {
            if (users[msg.sender].licenseIds[i] == _licenseId) {
                revert("You already own this license");
            }
        }
        // check if the id is correct
        require(
            licenses[_licenseId].licenseId == _licenseId,
            "Please enter a valid license id"
        );
        payable(licenses[_licenseId].licenseOwner).transfer(msg.value);
        // licenses[_licenseId].licenseOwner = payable(msg.sender);
        users[msg.sender].licenseIds.push(_licenseId);
    }
}
