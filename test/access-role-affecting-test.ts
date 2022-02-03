import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("AccessRoleAffecting", async function () {
  let accounts: SignerWithAddress[];
  let addresses: string[];
  let accessRoleAffecting: Contract;
  let whitelisting: Contract;

  it("Should deploy the AccessRoleAffecting & whitelisting contract", async function () {
    const AccessRoleAffecting = await ethers.getContractFactory("AccessRoleAffecting");
    accessRoleAffecting = await AccessRoleAffecting.deploy("10000");
    await accessRoleAffecting.deployed();

    const Whitelisting = await ethers.getContractFactory("Whitelisting");
    whitelisting = await Whitelisting.deploy();
    await whitelisting.deployed();

    accounts = await ethers.getSigners();
    addresses = accounts.map((account) => account.address);
  });

  it("Should not affect if not whitelisted", async function () {
    let error;
    await whitelisting.removeWhitelist(addresses[0]);
    try {
      await accessRoleAffecting.setMinter(addresses[1]);
    } catch (e: any) {
      error = e;
    }
    expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'your are not whitelisted'");
  });

  it("Should affect role correctly", async function () {
    await whitelisting.addWhitelist(addresses[0]);

    console.log("isWhitelisted", await whitelisting.isWhitelisted(addresses[0]), addresses[0]);

    await accessRoleAffecting.setMinter(addresses[1]);
    await accessRoleAffecting.setBurner(addresses[2]);
    await accessRoleAffecting.setTransferer(addresses[3]);

    expect(await accessRoleAffecting.getAccessRole(addresses[1])).to.equal(0);
    expect(await accessRoleAffecting.getAccessRole(addresses[2])).to.equal(1);
    expect(await accessRoleAffecting.getAccessRole(addresses[3])).to.equal(2);
  });
});
