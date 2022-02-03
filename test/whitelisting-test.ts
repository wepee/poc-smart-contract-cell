import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Whitelisting", async function () {
  let accounts: SignerWithAddress[];
  let addresses: string[];
  let whitelisting: Contract;

  it("Should deploy the Whitelisting contract", async function () {
    const Whitelisting = await ethers.getContractFactory("Whitelisting");
    whitelisting = await Whitelisting.deploy();
    await whitelisting.deployed();

    accounts = await ethers.getSigners();
    addresses = accounts.map((account) => account.address);
  });

  it("Should add address in whitelist", async function () {
    await whitelisting.addWhitelist(addresses[0]);
    expect(await whitelisting.isWhitelisted(addresses[0])).to.equal(true);
  });

  it("Should remove address in whitelist", async function () {
    await whitelisting.removeWhitelist(addresses[0]);
    expect(await whitelisting.isWhitelisted(addresses[0])).to.equal(false);
  });

  it("Should not add in Whitelist when sender is not Owner", async function () {
    let error;
    try {
      await whitelisting.connect(accounts[1]).addWhitelist(addresses[0]);
    } catch (e: any) {
      error = e;
    }
    expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'");
  });
});
