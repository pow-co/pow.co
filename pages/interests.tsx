import React, { useState, useEffect } from "react";
import axios from "axios";

import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useSensilet } from "../context/SensiletContext";
import ThreeColumnLayout from "../components/ThreeColumnLayout";

/* // Add .json extension to the artifact import
const { PersonalInterest } = require('../src/contracts/personalInterest');
const artifact = require('../artifacts/src/contracts/personalInterest.json');

try {

  PersonalInterest.loadArtifact(artifact);

} catch (error) {

  console.error('FAILED TO LOAD ARTIFACT', error);

} */

export interface PersonalInterestData {
  id: number;
  origin: string;
  location: string;
  topic: string;
  owner: string;
  weight: number;
  value: number;
  active: boolean;
  removal_location?: string;
  script_hash?: string;
  updatedAt: string;
  createdAt: string;
}

// Fetch personal interest data from API
export async function getPersonalInterestData({ txid }: { txid: string }): Promise<PersonalInterestData[]> {
  try {
    const { data } = await axios.get(`https://www.pow.co/api/v1/personal-interests/${txid}`);
    
    return data.interests || [];
  } catch (error) {
    console.error('error fetching personal interest data', error);
    return [];
  }
}

function PersonalInterestsPage() {
  const { web3Account, sensiletAuthenticate, sensiletPublicKey } = useSensilet();
  const router = useRouter();

  const [interests, setInterests] = useState<PersonalInterestData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);

  useEffect(() => {
    console.log('loading', loading);
  }, [loading]);

  useEffect(() => {
    setLoading(true);
    getPersonalInterestData({ txid: web3Account || '' })
      .then((interests) => {
        setInterests(interests);
        setLoading(false);
      })
      .catch((error) => {
        console.error('error interests', error);
        setLoading(false);
      });
  }, [web3Account]);

  async function connectSensilet() {
    try {
      await sensiletAuthenticate();
      setWalletConnected(true);
    } catch (error) {
      console.error('error logging in to sensilet', error);
    }
  }

  async function disconnect() {
    if (window && window.localStorage) {
      window.localStorage.removeItem('sensiletwallet');
      window.location.reload();
    }
  }

  async function onClickMintInterest() {
    try {

      if (!web3Account) {
        toast.error("Please connect your Sensilet wallet first");
        return;
      }

      // Use toast.promise instead of browser confirm
      const topic = await toast.promise(
        new Promise<string>((resolve) => {
          const userTopic = prompt("Enter Interest topic:");
          resolve(userTopic || "");
        }),
        {
          loading: "Enter Interest Topic",
          success: (topic) => topic || "Topic entered",
          error: "Failed to get topic",
        },
      );
      
      if (!topic) return;
      
      // Use toast.promise instead of browser confirm
      const weightStr = await toast.promise(
        new Promise<string>((resolve) => {
          const userWeight = prompt("Enter Interest weight:");
          resolve(userWeight || "");
        }),
        {
          loading: "Enter Interest Weight",
          success: (weight) => weight || "Weight entered",
          error: "Failed to get weight",
        },
      );
      
      if (!weightStr) return;
      
      const weight = parseInt(weightStr, 10);
      
      if (Number.isNaN(weight)) {
        toast.error("Invalid weight. Please enter a number.");
        return;
      }

      // const owner = sensiletPublicKey;

      /* const instance = new PersonalInterest(
        toByteString(topic, true),
        PubKey(owner),
        BigInt(weight),
      );

      const tx = await instance.deploy(1);

      console.log('deployed personal interest', tx);
      */

    } catch (error) {
      console.error('error miniting interest', error);
    }
  }

  return (
    <ThreeColumnLayout>
      <div className="mt-5 flex min-h-screen lg:mt-10">
        <div className="flex flex-col rounded-lg bg-primary-100 p-5 dark:bg-primary-600/20">
          <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Personal Interests</h1>
          
          {!walletConnected && !sensiletPublicKey ? (
            <button 
              type="button"
              onClick={connectSensilet} 
              className="mb-4 w-fit rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              Connect Sensilet
            </button>
          ) : (
            <button 
              type="button"
              onClick={disconnect} 
              className="mb-4 w-fit rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
            >
              Disconnect
            </button>
          )}

          <div>
            <p className="text-gray-700 dark:text-gray-300">
              {web3Account || 'Not Connected'}
            </p>
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Your Interests</h2>
          
          <ul className="mt-2 space-y-2">
          {interests.map((interest) => {

            if (interest.removal_location) { return null; }

            return (
              <li key={interest.origin} className="rounded p-2 hover:bg-primary-200 hover:dark:bg-primary-500/20">
                <a href={`/interests/${interest.origin}`} className="text-blue-600 hover:underline dark:text-blue-400">
                  {interest.topic} <span className="text-gray-500">({interest.weight})</span>
                </a>
              </li>
            );

          })}
          </ul>

          <div className="mt-4 flex flex-row space-x-4">
            <button 
              type="button" 
              onClick={onClickMintInterest}
              className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
            >
              Mint Interest
            </button>
            <button 
              type="button" 
              onClick={() => router.push('/interests/new')}
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              Create Interest
            </button>
          </div>

        </div>
      </div>
    </ThreeColumnLayout>
  );
}

export default PersonalInterestsPage;
