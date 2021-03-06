import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import ButtonAppBar from "../components/Header";
import { Dashboard } from "../pages/Dashboard";
import { Fighters } from "../pages/Fighters";
import { WalletManager } from "../pages/WalletManager";

export const App = () => {
  const [NFTs, setNFT] = useState([]);
  const [Assets, setAssets] = useState([]);
  const [Account, setAccount] = useState("");

  const [loginFlag, setLogin] = useState(true);
  const [balance, setBalance] = useState("");
  const [nickname, setNickname] = useState("");

  const [walletSession, setWalletSession] = useState(null);

  return (
    <>
      <BrowserRouter>
          <ButtonAppBar setWalletSession = {setWalletSession} Account = {Account} setAccount = {setAccount} balance = {balance} loginFlag = {loginFlag} nickname = {nickname} />
          <Routes>
            <Route path="/" element={<Dashboard walletSession={walletSession} NFTs = {NFTs} Assets = {Assets} Account = {Account}/>} />
          </Routes>
      </BrowserRouter>
    </>
  );
};
