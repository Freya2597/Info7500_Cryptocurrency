//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./NFTDutchAuctionERC20Bids.sol";


contract NFTDutchAuctionERC20BidsUpgradable is 
NFTDutchAuctionERC20Bids{

    function currentVersion() public pure returns(uint)
    {
        return 2;
    }

}