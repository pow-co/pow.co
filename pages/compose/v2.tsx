import React from 'react';
import { useRouter } from 'next/router';
import ThreeColumnLayout from '../../components/ThreeColumnLayout';
import ComposerV2 from '../../components/ComposerV2';

export default function Compose() {
  const router = useRouter();

  return (
    <ThreeColumnLayout>
      <div className="col-span-12 min-h-screen lg:col-span-6">
        <svg
          onClick={() => router.back()}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="relative -left-[42px] top-[69px] h-6 w-6 cursor-pointer stroke-gray-700 hover:opacity-70 dark:stroke-gray-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        <div className="mt-3 lg:mt-8">
          <ComposerV2 />
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
