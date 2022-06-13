
import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from "./Dashboard.module.scss";

import { useNavigate, useLocation } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DropDown from "../DropDown/DropDown";

import AnchorLink from 'anchor-link';
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport';
import { headerLinkData } from "../../config/constant";


import * as waxjs from "@waxio/waxjs/dist";

import './navbar.css';
export interface NFTProps {
  setWalletSession: any,
  Account: any,
  setAccount: any,
  balance: any,
  loginFlag: any,
  nickname: any,
}


// https://waxtestnet.greymass.com

// f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12

export default function ButtonAppBar({ setWalletSession, Account, setAccount, balance, loginFlag, nickname }: NFTProps) {

  let wallet_session:any;

  const navigate = useNavigate();
  const location = useLocation();
  let totalNFTs: any = [];
  const pages = ['Fighters', 'Arsenal', 'Arena', 'Leaderboard', 'Hall of fame', 'Packs', 'Staking'];
  const [headerActive, setHeaderActive] = useState(headerLinkData.fighter);
  // const [balance, setBalance] = useState("");

  const collection = "blockbunnies";
  // const [loginFlag, setLogin] = useState(true);
  const endpoint = "https://waxtestnet.greymass.com";
  const chainID = "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12";
  
  let display_nft = false;
  let loggedIn = false;
  const schema = "soldiers";
  const identifier = 'Crowd'
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [selectCity, setSelectCity] = useState<string>("");

  let walletType = "Anchor";


  const cities = () => {
    return ["My Profile", "My Inventory", "My Listings", "My Auctions"];
  };

  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
    if (event.currentTarget === event.target) {
      setShowDropDown(false);
    }
  };


  const citySelection = (city: string): void => {
    setSelectCity(city);
  };

  const wax = new waxjs.WaxJS({
    rpcEndpoint: endpoint
  });
  const main = async () => {

    if (loggedIn) {
      let assets = await GetAssets();
      if (assets.length != 0) PopulateData(assets);
    } else
      await autoLogin();
  }

  const autoLogin = async () => {
    let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
    if (isAutoLoginAvailable) {
      // wallet_userAccount = wax.userAccount;
      setAccount(wax.userAccount);
      let pubKeys = wax.pubKeys;
      let str = 'Player: ' + Account
      loggedIn = true;
      await main();
    }
  }


  const login = async () => {
    try {
      if (!loggedIn) {
        let wallet1_userAccount = await wallet_login();
        setAccount(wallet1_userAccount);
        let pubKeys = wax.pubKeys;
        let str = 'Player: ' + Account
        console.log(str);
        // setAccount(wallet1_userAccount);
        loggedIn = true;
        // setLogin(false);
        await main();
        let isWork = await wax.rpc
          .get_currency_balance("eosio.token", Account, "wax")
          .then((res) => {
            console.log("geeg", res[0]);
            // setBalance(res[0]);
            return true;
          })
          .catch((err) => {
            console.log("err", err);
            return false;
          });

      }
    } catch (e) {
    }
  }

  const dapp = "blockbunnies";

  async function wallet_login() {
    var wallet_Account;
    const transport = new AnchorLinkBrowserTransport();
    const anchorLink = new AnchorLink({
      transport,
      chains: [{
        chainId: chainID,
        nodeUrl: endpoint,
      }],
    }); 
    if (walletType == "Anchor") {
      var sessionList = await anchorLink.listSessions(dapp);
      if (sessionList && sessionList.length > 0) {
        wallet_session = await anchorLink.restoreSession(dapp);
      } else {
        wallet_session = (await anchorLink.login(dapp)).session;
      }
      wallet_Account = String(wallet_session.auth).split("@")[0];
      let auth = String(wallet_session.auth).split("@")[1];
      let anchorAuth = auth;
    } else {
      wallet_Account = await wax.login();
      wallet_session = wax.api;
      let anchorAuth = "active";
    }
    setWalletSession(wallet_session);
    
    return wallet_Account;
  }

  const GetAssets = async () => {
    let results = [];
    var path = "atomicassets/v1/assets?collection_name=" + collection + "&owner=" + Account + "&page=1&limit=1000&order=desc&sort=asset_id";
    const response = await fetch("https://" + "test.wax.api.atomicassets.io/" + path, {
      headers: {
        "Content-Type": "text/plain"
      },
      method: "POST",
    });
    const body = await response.json();
    if (body.data.length != 0)
      results = body.data;
    return results;
  }

  const PopulateData = async (assets: any) => {
    console.log("assets", assets);
    if (!display_nft) {
      totalNFTs = [];
      var src = "https://ipfs.atomichub.io/ipfs/";
      for (const data of assets) {
        let img_src = src + data.data.img;
        totalNFTs.push(img_src);
      }
      // setNFT(totalNFTs);
      // setAssets(assets);
      display_nft = true;
    }

  }

  const logout = async () => {
    loggedIn = false;
    display_nft = false;
    setAccount("");
  }
  const handleHeaderlink = (index: number) => {
    setHeaderActive(index);
    // const [showDropDown, setShowDropDown] = useState<boolean>(false);
    // const [selectCity, setSelectCity] = useState<string>("");
    // const cities = () => {
    //   return ["Hong Kong", "London", "New York City", "Paris"];
    // };
    console.log("sss = " + index)
    switch (index) {
      case headerLinkData.dashboard:
        navigate("/");
        break;
      case headerLinkData.fighter:
        navigate("/fighters");
        break;
      case headerLinkData.arsenal:
        navigate("/builder/builder_scenes");
        break;
      case headerLinkData.arena:
        window.open("https://doc.unicial.org");
        break;
      case headerLinkData.leaderboard:
        window.open("https://blog.unicial.org");
        break;
      case headerLinkData.halloffame:
        window.open("https://blog.unicial.org");
        break;
      case headerLinkData.packs:
        window.open("https://blog.unicial.org");
        break;
      case headerLinkData.staking:
        window.open("https://blog.unicial.org");
        break;
    }
  };

  const onClickLogin = () => {
    login();
  }

  const loginClick = () => {
    navigate("/wallet-manage");
  }

  const miningStyle = {
    backgroundImage: `url('../../image/mining_bg.png')`,
    width: '60px',
    height: '60px',
    backgroundSize: "100%",
    marginRight:"8px",
    marginLeft:"8px",
  }

  const loginBtnStyle = {
      backgroundColor: '#2cdada',
      color: '#182648',
      paddingLeft: "20px",
      paddingRight: "20px",
      fontWeight: 700,
      fontSize: "1.5rem",
      borderRadius: "10px",
  }

  return (
    <Box className = "Navbar" sx={{ flexGrow: 1 }} style={{ position: "sticky", top: 0, zIndex: "100" }}>
      <AppBar position="static">
        <Toolbar sx = {{justifyContent: "space-between" }}>
          <Typography className="logo" variant="h6" component="div" >
            <div className="logo-main" onClick={(e) => handleHeaderlink(1)}>
              <img src = "/image/nft-shape-logo.png"/>
              <svg className="label-blockbunies" width="180px" height="61px">
                <defs>
                    <filter filterUnits="userSpaceOnUse" id="Filter_0" x="0px" y="0px" width="296px" height="61px"  >
                    <feOffset in="SourceAlpha" dx="0" dy="10" />
                    <feGaussianBlur result="blurOut" stdDeviation="0" />
                    <feFlood flood-color="rgb(0, 0, 0)" result="floodOut" />
                    <feComposite operator="atop" in="floodOut" in2="blurOut" />
                    <feComponentTransfer><feFuncA type="linear" slope="0.35" /></feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                    </filter>

                </defs>
                <g filter="url(#Filter_0)">
                    <text kerning="auto" font-family="Myriad Pro" fill="rgb(0, 0, 0)" transform="matrix( 0.7781656809352, 0, 0, 0.86023037882758, 0.4594591887532, 46.5756442812758)" font-size="60px"><tspan font-size="60px" font-family="BadaBoomProBB" fill="#2CDADA">BLOCK</tspan><tspan font-size="32px" font-family="BadaBoomProBB" fill="#CCD53F">BUNNIES</tspan></text>
                </g>
              </svg>
            </div>
          </Typography>

          <Box sx={{ display: { xs: 'flex', md: 'flex' }, marginLeft: 3, }}>
            <div className="mining_btns">
              <div className="relative mining mx-1 px-1 my-1 py-1" style={miningStyle}>
                  <img className = "mine_icon_img" src = "/image/mininghammer.png"/>
                  <div className="mine_percent"><span>100%</span></div>
              </div>
              <div className="relative mining mx-1 px-1 my-1 py-1 flex items-center"  style={miningStyle}>
                  <img className = "mine_icon_img" src = "/image/mininghammer.png"/>
                  <div className = "mine_percent"><span>100%</span></div>
              </div>
              <div className="relative mining mx-1 px-1 my-1 py-1"  style={miningStyle}>
                  <img className = "mine_icon_img" src = "/image/miningwarning.png"/>
                  <div className = "mine_percent"><span>100%</span></div>
              </div>
            </div>
            <div className="balance_labels" style={{color:"#facc15"}}>
              <div>BUNNYCOIN 12000</div>
              <div>CARROTS 48050</div>
            </div>

            <button
              className={showDropDown ? "active" : undefined}
              onClick={onClickLogin}
              style={loginBtnStyle}
            >
              {Account!=""?Account:"Login"}
          </button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
