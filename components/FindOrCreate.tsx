import { useRouter } from "next/router";
import React, { useState } from "react";
import { wrapRelayx } from "stag-relayx";
import { toast } from "react-hot-toast";
import { useRelay } from "../context/RelayContext";
import { useBitcoin } from "../context/BitcoinContext";
import useWallet from "../hooks/useWallet";
import Drawer from "./Drawer";
import WalletProviderPopUp from "./WalletProviderPopUp";

import axios from 'axios'

function FindOrCreate() {
  const [url, setUrl] = useState<string>("");
  const router = useRouter();
  const { authenticated } = useBitcoin()
  const [walletPopupOpen, setWalletPopupOpen] = useState(false)
  const { relayOne } = useRelay();

  const wallet = useWallet()

  const stag = wrapRelayx(relayOne);

  const handleChangeUrl = (e: any) => {
    e.preventDefault();
    setUrl(e.target.value);
  };

  const findOrCreate = async (url: string) => {
    if(!authenticated || !wallet){
      setWalletPopupOpen(true)
      return
    }
    const BITCOIN_TXN_REGEX = /^[0-9a-fA-F]{64}$/;
    const TWETCH_TXN_REGEX =
      /^https:\/\/(twetch\.(com|app))\/t\/[a-fA-F0-9]{64}$/;
    const RELAY_CLUB_TXN_REGEX =
      /^https:\/\/club\.relayx\.com\/p\/[a-fA-F0-9]{64}$/;

    const matchBitcoin = BITCOIN_TXN_REGEX.test(url);
    const matchTwetch = TWETCH_TXN_REGEX.test(url);
    const matchRelay = RELAY_CLUB_TXN_REGEX.test(url);

    if (matchBitcoin) {
      router.prefetch(`/${url}`);
      router.push(`/${url}`);
      return;
    }
    if (matchTwetch || matchRelay) {
      const txid = url.split("/")[4];
      router.prefetch(`/${txid}`);
      router.push(`/${txid}`);
    } else {
      try {
        const tx = await wallet.onchainFindOrCreate({
          where: {
            app: "pow.co",
            type: "url",
            content: {
              url,
            },
          },
          defaults: {
            app: "pow.co",
            type: "url",
            content: {
              url,
            },
          },
        });

        console.log(tx);
        router.prefetch(`/${tx.hash}`);
        router.push(`/${tx.hash}`);
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
    }
  };

  const handleKeyUp = (e: any) => {
    e.preventDefault();
    const enterKey = 13;
    if (e.keyCode === enterKey) {
      console.log("typed enter", url);
      toast("Loading data...", {
        icon: "⛏️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      findOrCreate(url);
    }
  };
  return (
    <>
    <form onSubmit={(e: any) => e.preventDefault()} className="w-full px-4">
      <label
        htmlFor="search-txid"
        className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 text-gray-500 dark:text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
            />
          </svg>
        </div>
        <input
          autoComplete="off"
          type="search"
          id="search-txid"
          value={url}
          onChange={handleChangeUrl}
          onKeyUp={handleKeyUp}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
          placeholder="Share any URL or BitCoin transaction"
        />
        <button
          type="submit"
          className="invisible absolute bottom-2.5 right-2.5 rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Search
        </button>
      </div>
    </form>
    <Drawer
        selector="#walletProviderPopupControler"
        isOpen={walletPopupOpen}
        onClose={() => setWalletPopupOpen(false)}
      >
        <WalletProviderPopUp onClose={() => setWalletPopupOpen(false)} />
    </Drawer>
    </>
  );
}

export default FindOrCreate;
