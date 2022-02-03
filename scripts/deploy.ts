// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const Whitelisting = await ethers.getContractFactory("Whitelisting");
  const whitelisting = await Whitelisting.deploy();
  await whitelisting.deployed();

  console.log("Whitelisting deployed to:", whitelisting.address);

  const AccessRoleAffecting = await ethers.getContractFactory("Whitelisting");
  const accessRoleAffecting = await AccessRoleAffecting.deploy();

  await accessRoleAffecting.deployed();

  console.log("AccessRoleAffecting deployed to:", accessRoleAffecting.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
