
import React, { useEffect, useState } from "react";
import axios from "axios";
import PanelLayout from '../components/PanelLayout'
import NFTCard from "../components/market/NFTCard";
import ThreeColumnLayout from "../components/ThreeColumnLayout"

export default function Collectibles() {
  console.log("collectibles");

  const misprints = [
    "254cc23144c64cc9f4c249146ce7c52dc13a76a114fb8eb69347aa5e3e7689bf_o2", //misprint
    "5ab72c164de3514848a086e99975be1508124db704f273a616baa42cf820a1dc_o2", //misprint
    "28b6e0569c6093f8a65962a2d9d66220d610594a5bc39c2021ace64a4bcd3dfe_o2", //misprint
    "3da59cdf5391d0d09e10a8dcb6fb6fb1220ea74b168a7f1770743dd9eebd35fb_o2" //artist contract
  ];

  // const [totalMints, setTotalMints] = useState(0);
  // const [pages, setPages] = useState(0);
  const [mintedCollections, setMintedCollections] = useState([]);


  // TODO: Refactor this to use a reducer
  useEffect(() => {
    (async () => {
      // Get the number of Geist mints
      const userProfile = await axios.get(
        `https://staging-backend.relayx.com/api/profile/geist@relayx.io`
      );

      const totalMints = userProfile.data.data.minted;

      const pages = Math.ceil(totalMints / 10);

      const filteredGeistCollections = [];

      //Cycle through the pages and get the data
      for (let index = 1; index <= pages; index++) {
        const { data } = await axios.get(
          `https://staging-backend.relayx.com/api/mint/list?page=${index}&paymail=geist@relayx.io`
        );
        // Filter out the misprints
        const filteredMints = data.data.mints.filter(
          (mint: any) => !misprints.includes(mint.location)
        );
        console.log("mintedCollections", mintedCollections);
        filteredGeistCollections.push(...filteredMints);
        // console.log("mintedCollections", mintedCollections);
      }

      //@ts-ignore
      setMintedCollections([...mintedCollections, ...filteredGeistCollections]);
    })();
  }, []);


  return (
    <PanelLayout>
      <div className="font-bold text-4xl m-4 text-center">
        <h1>The GEIST Catalogue</h1>
      </div>
      <div className="bg-gray-200 flex flex-wrap">
        {mintedCollections?.map((mintedCollection: any) => (
          <NFTCard key={mintedCollection.location} nft={mintedCollection} />
        ))}
      </div>
    </PanelLayout>
  );


}

/*
- get the collections ✅
- show collectibles in a list  ✅
- remove false mints ✅
- create NFTCard component ✅
- Get user's collectibles ✅
- display NFTs in a grid ✅
- fix night/day mode view []
- Show a sillhoute of the collectibles
- if logged in, show which collectibles you have
- show which ones you don't have as silhouettes
*/
