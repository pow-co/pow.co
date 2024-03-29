import React from "react";
import Image from "next/image";
import axios from 'axios';
import { useRelay } from "../context/RelayContext";
import { useBitcoin } from "../context/BitcoinContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

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

const NFTItemCard = ({ nft }: { nft: NFTItemData }) => {
  const { relayOne } = useRelay();
  const { wallet } = useBitcoin();
  const router = useRouter()

  const buyItem = async () => {
    const ownerResponse = await relayOne!.alpha.run.getOwner();

    try {
      const response = await axios.post(
        "https://staging-backend.relayx.com/api/dex/buy2",
        {
          buyer: ownerResponse,
          cls: nft.item.origin,
          location: nft.item.location,
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

  return (
    <div className="max-w-md rounded overflow-hidden shadow-lg mx-auto bg-white hover:shadow-xl">
      <div className="relative">
        <Image
          alt="berry"
          src={
            nft?.item?.berry?.txid
              ? `https://berry.relayx.com/${nft?.item?.berry?.txid}`
              : `https://berry.relayx.com/${nft?.token?.icon?.berry}`
          }
          className="w-full h-64 object-cover"
          width={320}
          height={320}
        />
        <div className="absolute top-0 right-0 bg-purple-500 text-white p-2 font-bold">
          #{nft?.item?.props?.no}
        </div>
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-purple-500">
          <a
            href={`https://relayx.com/assets/${nft?.token?.origin}/${nft?.item?.origin}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {nft?.token?.name}
          </a>
        </div>
        <p className="text-gray-700 text-base">{nft?.token?.description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 hover:bg-purple-300">
          Creator: {`${nft?.token?.creator}`}
        </span>
        <span className="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 hover:bg-purple-300">
          Owner: {`${nft?.item?.paymail}`}
        </span>

        {nft?.item?.satoshis && nft?.item?.satoshis !== 0 && (
        <span className="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 hover:bg-purple-300">
          Price: {nft?.item?.satoshis * 1e-8}₿
        </span>
        )}

        <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">

        <button
          className="inline-flex items-center justify-center h-8 px-4 py-2 font-medium text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2"
          onClick={handleBuy}
          style={{
            background: nft?.item?.satoshis || nft?.item?.satoshis === 0 ? "#3b82f6" : "#ef4444",
          }}
          disabled={!nft?.item?.satoshis || nft?.item?.satoshis === 0}
        >
          {!nft?.item?.satoshis || nft?.item?.satoshis === 0 ? (
            <span className="px-5 py-2 rounded-2xl text-white">
              Sold
            </span>
          ) : (
            <>
              <span className="mr-2">{nft?.item?.satoshis * 1e-8}₿</span>
              <span>Buy</span>
            </>
          )}
        </button>
        </span>
      </div>
    </div>
  );
};

export default NFTItemCard;
