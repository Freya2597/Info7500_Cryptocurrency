// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract BasicDutchAuction {

    // numBlocksAuctionOpen: the number of blockchain blocks that the auction is open for
    uint public numBlocksAuctionOpen;
    // offerPriceDecrement: the amount of wei that the auction price should decrease by during each subsequent block.
    uint public offerPriceDecrement;
    // reservePrice: the minimum amount of wei that the seller is willing to accept for the item
    uint public reservePrice;
    uint public initialPrice;
    // the block number that the auction was deployed
    uint public auctionStartBlock;
    // the owner is the seller
    address payable public owner;

    constructor(uint256 _reservePrice, uint256 _numBlocksAuctionOpen, uint256 _offerPriceDecrement) {
        reservePrice = _reservePrice;
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;
        owner = payable(msg.sender);
        auctionStartBlock = block.number;
        initialPrice = _reservePrice + (_numBlocksAuctionOpen * _offerPriceDecrement);
    }

    // bid can be called by anyone to place a bid
    function bid() public payable returns(address) {
        // if the auction is over, the bid is reverted
        require(block.number <= auctionStartBlock + numBlocksAuctionOpen, "Auction is over");
        // calculate the current price
        uint currentPrice = initialPrice - ((block.number - auctionStartBlock) * offerPriceDecrement);
        require(msg.value >= currentPrice, "Low bid");
        // bid is accepted, transfer token to owner
        owner.transfer(msg.value);
        return msg.sender;
    }
}