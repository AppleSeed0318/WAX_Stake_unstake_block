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
  NFTs: any,
  Assets: any,
  Account: any,
}

export const Dashboard = ({ NFTs, Assets, Account }: NFTProp) => {

  const [showNFTs, setShowNFTs] = useState(Assets);
  const [filters, setFilters] = useState(["Series", "Name", "Rarity", "Powerscore", "Class Card"]);
  let filterData = [

    { value: "0", data: ["Series", "series1", "promo"] },
    { value: "0", data: ["Name", "Ryu", "Chun-Li", "Nash", "M. Bison", "Cammy", "Birdie", "Ken", "Necalli", "Vega", "R. Mika", "Gill", "Rashid", "Karin", "Zangief", "Laura", "Dhalsim", "F.A.N.G", "Alex", "Guile", "Ibuki", "Balrog", "Juri", "Urien", "Akuma", "Kolin", "Ed", "Abigail", "Menat", "Zeku", "Sakura", "Blanka", "Falke", "Cody", "G", "Sagat", "Seth", "E. Honda", "Poison", "Kage", "Lucia"] },
    { value: "0", data: ["Rarity", "Golden", "Build", "Base", "Foil", "Battle", "Weld", "Action", "Collector's Edition"] },
    { value: "0", data: ["Powerscore", "1", "2", "3", "4", "5"] },
    { value: "0", data: ["Class Card", "Class - Base", "Class - Foil", "Class - Weld", "Class - Battle", "Class - Action", "Class - Collector's Edition"] },
  ];

  let uri_prefix = "https://ipfs.infura.io/ipfs/";

  
  return (
    <>
    <main className={styles.main}>
      <section className={styles.section}>
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

        <Box>
          <h1>Farming Time!</h1>
          <h2>CREW FARMING</h2>

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
            <label>TOTAL FARMING POWER</label>
            <span>0000</span>
          </Box>
          <Box>
            <label>TIME UNTIL NEXT CLAIM </label>
            <span>4:00</span>
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
