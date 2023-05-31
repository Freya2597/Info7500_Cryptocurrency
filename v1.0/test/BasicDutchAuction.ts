import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BasicDutchAuction", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployBasicDutchAuctionFixture() {
    // initialPrice will be 250
    const reservePrice = 50;
    const numBlocksAuctionOpen = 100;
    const offerPriceDecrement = 2;

    const [owner, otherAccount] = await ethers.getSigners();
    const BasicDutchAuction = await ethers.getContractFactory("BasicDutchAuction");
    const basicDutchAuction = await BasicDutchAuction.deploy(reservePrice, numBlocksAuctionOpen, offerPriceDecrement);
    return { basicDutchAuction, reservePrice, numBlocksAuctionOpen, offerPriceDecrement, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Set the right reservePrice", async function () {
      const { basicDutchAuction, reservePrice } = await loadFixture(deployBasicDutchAuctionFixture);
      expect(await basicDutchAuction.reservePrice()).to.equal(reservePrice);
    });
    it("Set the right numBlocksAuctionOpen", async function () {
      const { basicDutchAuction, numBlocksAuctionOpen } = await loadFixture(deployBasicDutchAuctionFixture);
      expect(await basicDutchAuction.numBlocksAuctionOpen()).to.equal(numBlocksAuctionOpen);
    });
    it("Set right initialPrice", async function () {
      const { basicDutchAuction, reservePrice, offerPriceDecrement, numBlocksAuctionOpen } = await loadFixture(deployBasicDutchAuctionFixture);
      expect(await basicDutchAuction.initialPrice()).to.equal(reservePrice + (numBlocksAuctionOpen * offerPriceDecrement));
    });
  });

  describe("bid", function () {
    it('Bid is rejected that is lower than currentPrice', async function () {
      const { basicDutchAuction, otherAccount } = await loadFixture(deployBasicDutchAuctionFixture);
      await time.advanceBlock(10);
      await expect(basicDutchAuction.connect(otherAccount).bid({value: 220})).to.be.revertedWith("Low bid");
    });
    it('Bid is successful that is higher than currentPrice', async function () {
        const { basicDutchAuction, otherAccount } = await loadFixture(deployBasicDutchAuctionFixture);
        await time.advanceBlock(10);
        const returnedAddress = await basicDutchAuction.connect(otherAccount).callStatic.bid({value: 230});
        expect(returnedAddress).to.equal(otherAccount.address);
    });
    it("Bid is reverted when the auction is over", async function () {
        const { basicDutchAuction, otherAccount } = await loadFixture(deployBasicDutchAuctionFixture);
        await time.advanceBlock(101);
        await expect(basicDutchAuction.connect(otherAccount).bid({value: 1000})).to.be.revertedWith("Auction is over");
    });
    it("Bid shoould be at the reservePrice when the auction is passing a certain amount of time", async function () {
      const { basicDutchAuction, otherAccount } = await loadFixture(deployBasicDutchAuctionFixture);
      await time.advanceBlock(100);
      expect(await basicDutchAuction.connect(otherAccount).callStatic.bid({value: 50})).to.equal(otherAccount.address);
    });
  });
});