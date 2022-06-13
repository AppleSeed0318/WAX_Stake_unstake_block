import { useEffect, useState } from "react";
import styles from "./Dashboard.module.scss";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Grid, Box, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Link } from "react-router-dom";

import NFTCard from "../../components/NFTCard";
import { maxHeight } from "@mui/system";
import MenuItem from '@mui/material/MenuItem';
import * as waxjs from "@waxio/waxjs/dist";

import Modal from '@mui/material/Modal';


export interface NFTProp {
  walletSession: any,
  NFTs: any,
  Assets: any,
  Account: any,
}

export const Dashboard = ({ walletSession, NFTs, Assets, Account }: NFTProp) => {

  const [showNFTs, setShowNFTs] = useState(Assets);
  const [filters, setFilters] = useState(["Series", "Name", "Rarity", "Powerscore", "Class Card"]);
  
  var crewPower:any = {}, toolPercent:any = {};

  crewPower["204519"] = 0.2; crewPower["204521"] = 0.2; crewPower["204523"] = 0.66; crewPower["204523"] = 0.66; 
  crewPower["204528"] = 2.18; crewPower["204529"] = 7.19; crewPower["204531"] = 23.72; crewPower["204532"] = 78.27;
  crewPower["204535"] = 258.29;

  toolPercent["232860"] = 1; toolPercent["232861"] = 1; toolPercent["232862"] = 1; toolPercent["232864"] = 2;
  toolPercent["232887"] = 4; toolPercent["232892"] = 2; toolPercent["232893"] = 4; toolPercent["232894"] = 2; 
  toolPercent["233274"] = 4;

  console.log(crewPower, toolPercent);

  const contract_owner_name = 'appleseeddiv';
  let uri_prefix = "https://ipfs.infura.io/ipfs/";

  const calcPower = (crewNFTs:any, toolNFTs:any) => {

    var pw = 0, pc = 0;
    for (var i = 0; i < 9; i ++) {
      pw += crewPower[crewNFTs[i].asset_id];
      pc+= toolPercent[toolNFTs[i].asset_id];
    }

    var result = Math.floor(pw + pw * pc / 100);
    return result;
  }

  const stake = async (asset_ids:any) => {
    
    // let wallet1_userAccount = await wax.login();
    console.log("Account", Account, walletSession);
    if (!walletSession || Account == "") {
      console.log('* Login first *');
    }
    try {
      const result = await walletSession.transact({
        actions: [{
          account: "atomicassets",
          name: 'transfer',
          authorization: [{
            actor: Account,
            permission: 'active',
          }],
          data: {
            from: Account,
            to: contract_owner_name,
            asset_ids: asset_ids,
            memo: 'blockbunnies',
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30
      });

      if (result) {

        regstake(asset_ids);
      }
      else {
        console.log("result value is null, stake request faild!!!");
      }

    } catch (e) {
      console.log("An error is occured in stake");
      console.log(e);
    }
  }

  const regstake = async (asset_ids:any) => {
    if (!walletSession || Account == "") {
      console.log('* Login first *');
    }
    try {
      const result = await walletSession.transact({
        actions: [{
          account: contract_owner_name,
          name: 'unstake',
          authorization: [{
            actor: Account,
            permission: 'active',
          }],
          data: {
            username: Account,
            memo: 'blockbunnies',
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30
      });

    } catch (e) {
      console.log("An error is occured in unstake");
      console.log(e);
    }
  }

  const claim = async () => {
    
  }

  
  return (
    <>
    <main className={styles.main}>
      <nav className = {styles.navbar}>
        <ul>
          <li><Link to={`/#`}>MINING</Link></li>
          <li><Link to={`/#`}>FARMING</Link></li>
          <li><Link to={`/#`}>BATTLE</Link></li>
          <li><Link to={`/#`}>EXPLORE</Link></li>
          <li><Link to={`/#`}>CARFT</Link></li>
          <li><Link to={`/#`}>STAKING</Link></li>
        </ul>
      </nav>
      <section className={styles.section}>
        <Box>
          <h1>Farming Time!</h1>
          <h2>CREW FARMING</h2>
        </Box>
        <Box className={styles.crew_nft_group}>
          <span>CHOOSE 9 CREW NFTS</span>
          <Box className={styles.nft_block}>
            {Account!="" && <ul className={styles.crew_nfts}>
              <li><img src = "/image/nft.png" /></li>
              <li><img src = "/image/nft.png" /></li>
              <li><img src = "/image/nft.png" /></li>
              <li><img src = "/image/nft.png" /></li>
              <li><img src = "/image/nft.png" /></li>
              <li><img src = "/image/nft.png" /></li>
              <li><img src = "/image/nft.png" /></li>
              <li><img src = "/image/nft.png" /></li>
              <li><img src = "/image/nft.png" /></li>
            </ul>}
          </Box>
        </Box>
        <Box className={styles.mining_nft_group}>
          <span>CHOOSE 9 MINING TOOLS</span>
          <Box className={styles.nft_block}>
            {Account != "" && <ul className={styles.tool_nfts}>
              <li><img src = "/image/nft.png" /></li>
              <li><img src = "/image/nft.png" /></li>
              <li><img src = "/image/nft.png" /></li>
              <li><img src = "/image/nft.png" /></li>
              <li><img src = "/image/nft.png" /></li>
              <li><img src = "/image/nft.png" /></li>
              <li><img src = "/image/nft.png" /></li>
              <li><img src = "/image/nft.png" /></li>
              <li><img src = "/image/nft.png" /></li>
            </ul>}
          </Box>
        </Box>
        <Box>
          <Grid container spacing={0} >
            {showNFTs.map((NFT: any) => (
              <>
                  <NFTCard key={NFT.data.img} uri={uri_prefix + NFT.data.img} name={NFT.name} account={Account} assetID={NFT.asset_id} backed_tokens={NFT.backed_tokens}/>
              </>
            ))}
          </Grid>
        </Box>

        <Box>
          <Box>
            <div><label>TOTAL FARMING POWER</label></div>
            <h1>0000</h1>
          </Box>
          <Button sx = {{backgroundColor: "#1abccc", color: "white"}}>Staking</Button>

          <Box>
            <label style={{fontSize:"30px"}}>TIME UNTIL NEXT CLAIM: </label>
            <label style={{fontSize:"30px"}}>4:00</label>
          </Box>
          <Button sx = {{backgroundColor: "#d8e41e"}}>Claim</Button>
        </Box>
      </section>
    </main>
    <footer className={styles.footer}>
      <p className={styles.footerAnchor}>
        © Copyright 2022 Block Bunnies
      </p>
    </footer>
    </>
  );
};
