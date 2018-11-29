pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 {

    struct Star {
        string name;
        string starStory;
        string ra;
        string dec;
        string mag;
    }

    mapping(uint256 => Star) public starIdToStarInfo; 
    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => Star) _tokenToStarInfo;
    mapping(uint256 => bool) _tokenExists;
    mapping(uint256 => uint256) public starsForSale;
    
    uint256 public count = 0;
    
    function createStar(string _name, string _dec, string _mag, string _cent, string _story, uint256 _tokenId) public returns(uint256) {
        uint256 starHash = _hashify_star(_dec, _mag, _cent);
        require(!_starExists(starHash), "Star already exists");
        _tokenExists[starHash] = true;
        
        Star memory newStar = Star(_name, _dec, _mag, _cent, _story);
        _tokenToStarInfo[starHash] = newStar; // do cara noiado
        tokenIdToStarInfo[_tokenId] = newStar; // meu
        //count = count + 1;
        _mint(msg.sender, _tokenId);
    }
    
    function _hashify_star(string dec, string mag, string cent) private pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(dec, mag, cent)));
    }
    
    function _starExists(uint256 starHash) private view returns (bool) {
        return (_tokenExists[starHash]);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public { 
        require(this.ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable { 
        require(starsForSale[_tokenId] > 0);
        
        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);
        
        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }
}