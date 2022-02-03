//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Whitelisting is Ownable {
    mapping(address => bool) private whitelist;

    constructor() {
        console.log("Deploying Whitelisting");
    }

    function addWhitelist(address _address) external onlyOwner {
        whitelist[_address] = true;
    }

    function removeWhitelist(address _address) external onlyOwner {
        whitelist[_address] = false;
    }

    function isWhitelisted(address _address) public view returns (bool) {
        return whitelist[_address];
    }

    modifier onlyWhitelisted() {
        require(isWhitelisted(_msgSender()), "your are not whitelisted");
        _;
    }
}
