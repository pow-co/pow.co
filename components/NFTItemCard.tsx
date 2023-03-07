import React from "react";
import Image from "next/image";

type NFTItemData = {
  token: {
    location: string;
    origin: string;
    name: string;
    nonce: number;
    symbol: string;
    owner: string;
    issued: number;
    burned: number;
    whitepaper: string;
    description: string;
    nft: boolean;
    royalties: [
      {
        address: string;
        royalty: number;
      }
    ];
    icon: {
      berry: string;
    };
    isEncrypted: boolean;
    floor: number;
    against: string;
    price: number;
    vol: number;
    status: string;
    message: string;
    owners: number;
    creator: string;
  };
  item: {
    revealed: boolean;
    txid: string;
    seller: string;
    satoshis: number;
    location: string;
    origin: string;
    berry: {
      txid: string;
    };
    props: {
      no: number;
      satoshis: number;
    };
    owner: string;
    traits: null;
    paymail: string;
  };
};

const buyItem = async () => {
  const ownerResponse = await relayOne!.alpha.run.getOwner();

  try {
    const response = await axios.post(
      "https://staging-backend.relayx.com/api/dex/buy2",
      {
        buyer: ownerResponse,
        cls: props.jig.cls.origin,
        location: props.jig.location,
      }
    );

    const sendResponse = await relayOne!.send(response.data.data.rawtx);
    console.log(sendResponse);
    return sendResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const handleBuy = async (e: any) => {
  e.preventDefault();
  if (wallet !== "relayx") {
    toast("Cannot buy run NFTs with Twetch Wallet. Please switch to RelayX", {
      icon: "🛑",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
    return;
  }
  toast("Publishing Your Buy Order to the Network", {
    icon: "⛏️",
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    },
  });
  try {
    const resp = await buyItem();
    toast("Success!", {
      icon: "✅",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
    router.reload();
  } catch (error) {
    console.log(error);
    toast("Error!", {
      icon: "🐛",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  }
};

const NFTItemCard = ({ nft }: { nft: NFTItemData }) => {
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
        <img
          alt="berry"
          src={`https://berry.relayx.com/${nft?.item?.berry?.txid}`}
          className="rounded-t-lg object-cover object-center"
        />
      </div>

      <div className="px-6 my-2">
        <div className="font-bold text-xl text-gray-700 mb-2 hover:text-blue-300">
          <a
            href={`https://relayx.com/market/${nft?.origin}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h1>
              {nft?.token?.name} #{nft?.item?.props?.no}
            </h1>
          </a>
        </div>
      </div>
      <div className="px-6 sticky top-[100vh]">
        <span className="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 hover:bg-blue-300">
          Creator: {`${nft?.token?.creator}`}
        </span>
        <span className="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 hover:bg-blue-300">
          Owner: {`${nft?.item?.paymail}`}
        </span>
        {nft?.item?.satoshis && (
        <div className="mr-5">
          {nft?.item?.satoshis === 0 ? (
            <div className="px-5 py-2 bg-red-600 rounded-2xl text-white">
              Sold
            </div>
          ) : (
            <div
              onClick={handleBuy}
              className="px-5 py-2 bg-blue-600 rounded-2xl text-white text-center cursor-pointer"
            >
              Buy {nft?.item?.satoshis * 1e-8}₿
            </div>
          )}
        </div>
      )}
      </div>

    </div>
  );
};

export default NFTItemCard;
