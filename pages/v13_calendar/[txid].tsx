'use client'
import React, { useEffect, useMemo, useState } from "react";
import ThreeColumnLayout from "../../components/v13_ThreeColumnLayout";
import { useBitcoin } from "../../v13_context/BitcoinContext";
import UserIcon from "../../components/UserIcon";
import Datepicker from "tailwind-datepicker-react";

import {
  SmartContract,
  Scrypt,
  bsv,
  HashedSet,
  PubKey,
  TestWallet,
  ScryptProvider,
  ContractCalledEvent,
} from "scrypt-ts";
import axios from "axios";
import useWallet from "../../hooks/v13_useWallet";
import { useParams, useRouter } from "next/navigation";

import { Meeting } from "../../src/contracts/meeting";
import artifact from "../../artifacts/meeting.json";
import { fetchTransaction } from "../../services/whatsonchain";

Meeting.loadArtifact(artifact);

Scrypt.init({
  apiKey: String(process.env.NEXT_PUBLIC_SCRYPT_API_KEY),
  network: bsv.Networks.livenet,
});

class Wallet extends TestWallet {
  get network() {
    return bsv.Networks.livenet;
  }
}

const signer = new Wallet(new bsv.PrivateKey());

const provider = new ScryptProvider();

async function getEventData(origin: string) {

}

const EventDetailPage = async ({
  params: { txid },
}: {
  params: { txid: string }
}) => {
  const eventData = await getEventData(txid)

  console.log(eventData)

  return (
      <ThreeColumnLayout>
        <div className="mt-5 sm:mt-10 min-h-screen">
          
        </div>
      </ThreeColumnLayout>
  );
};

export default EventDetailPage;
