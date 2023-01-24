import React from "react";
import Head from "next/head";
import ThreeColumnLayout from "../../components/ThreeColumnLayout";
import Composer from "../../components/Composer";
import { useRouter } from "next/router";

export default function Compose() {
  const router = useRouter();
  const navigate = (txid: string) => {
    router.push(`/questions/${txid}`);
  };
  return (
    <ThreeColumnLayout>
      <div className="col-span-12 lg:col-span-6 min-h-screen">
        <svg
          onClick={() => router.back()}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="relative top-[69px] -left-[42px] w-6 h-6 stroke-gray-700 dark:stroke-gray-300 cursor-pointer hover:opacity-70"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        <div className="mt-3 lg:mt-8 mb-[200px] lg:rounded-xl pt-4 pb-3">
            <Composer/>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}