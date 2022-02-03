//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Whitelisting.sol";
import "hardhat/console.sol";

contract AccessRoleAffecting is Whitelisting, ERC20 {
    enum AccessRole {
        Minter,
        Burner,
        Transferer
    }

    mapping(address => AccessRole) internal accessList;

    constructor(uint initialSupply) ERC20("sTREEB", "sTREEB") {
        _mint(msg.sender, initialSupply);
        console.log("Deploying AccessRoleAffecting");
    }

    function setMinter(address _newMinterAddress) public onlyWhitelisted {
        accessList[_newMinterAddress] = AccessRole.Minter;
    }

    function setBurner(address _newBurnerAddress) public onlyWhitelisted {
        accessList[_newBurnerAddress] = AccessRole.Burner;
    }

    function setTransferer(address _newTransfererAddress)
        public
        onlyWhitelisted
    {
        accessList[_newTransfererAddress] = AccessRole.Transferer;
    }

    function getAccessRole(address _address) public view returns (AccessRole) {
        return accessList[_address];
    }

    function forceTransfer(
        address _from,
        address _to,
        uint _amount
    ) public onlyTransferer {
        _transfer(_from, _to, _amount);
    }

    function mint(address account, uint amount) public onlyMinter {
        _mint(account, amount);
    }

    function burn(address account, uint amount) public onlyBurner {
        _burn(account, amount);
    }

    modifier onlyMinter() {
        require(
            accessList[msg.sender] == AccessRole.Minter,
            "your are not a Minter"
        );
        _;
    }

    modifier onlyBurner() {
        require(
            accessList[msg.sender] == AccessRole.Burner,
            "your are not a Burner"
        );
        _;
    }

    modifier onlyTransferer() {
        require(
            accessList[msg.sender] == AccessRole.Transferer,
            "your are not Transferer"
        );
        _;
    }
}
