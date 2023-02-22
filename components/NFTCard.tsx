import React from "react";
import Image from "next/image";

const NFTCard = ({ nft }) => {
  return (
    <div className="pt-6 pb-6 max-w-xs rounded overflow-hidden shadow-lg ml-auto mr-auto hover:bg-slate-100">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "auto",
          maxHeight: 320, //343
          position: "relative",
        }}
      >
        {/* {false ? (
          <Image
            alt={"Purchase NFTS to view"}
            src={"/images/sillhouette.png"}
            width="100%"
            height="100%"
            layout="responsive"
            margin-top="100px"
            border="10px solid #000"
            resizeMode="contain"
          />
        ) : (
          <Image
            alt={nft.image}
            src={`https://berry2.relayx.com/${nft.berry}`}
            width="100%"
            height="100%"
            layout="responsive"
            margin-top="100px"
            border="10px solid #000"
            resizeMode="contain"
          />
        )} */}
      </div>

      <div className="px-6 py-6">
        <div className="font-bold text-xl text-gray-700 mb-2 hover:text-blue-300">
        <a
        href={`https://relayx.com/market/${nft.origin}`}
        target="_blank"
        rel="noopener noreferrer">
          <h1>
            {nft.name}
          </h1>
        </a>
        </div>
        <p className="text-blue-700 text-base">{nft.description}</p>
      </div>
      <div className="px-6 pt-2 pb-2 sticky top-[100vh]">
        <span className="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          Editions: {" "}
          {nft.total === undefined ? "Not issued" : nft.total}
        </span>
        <span className="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 hover:bg-blue-300">
          <a href={`https://relayx.com/token/${nft.origin}/owners`} target="_blank" rel="noopener noreferrer">
            Owners: {`${nft.owners}`}
          </a>
        </span>
        <span className="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          Floor Price:{" "}
          {nft.price === undefined ? "None" : nft.price / 100000000 + " BSV"}
        </span>
      </div>
    </div>
  );
};

export default NFTCard;
