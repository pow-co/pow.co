import React from 'react';
import Image from 'next/image';

type NFT = {
  origin: string;
  name: string;
  description: string;
  total: string;
  owners: string;
  price: number;
};

function NFTCard({ nft }: { nft: NFT }) {
  return (
    <div className="mx-auto max-w-xs overflow-hidden rounded py-6 shadow-lg hover:bg-slate-100">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'auto',
          maxHeight: 320, // 343
          position: 'relative',
        }}
      />

      <div className="p-6">
        <div className="mb-2 text-xl font-bold text-gray-700 hover:text-primary-300">
          <a
            href={`https://relayx.com/market/${nft.origin}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h1>
              {nft.name}
            </h1>
          </a>
        </div>
        <p className="text-base text-primary-700">{nft.description}</p>
      </div>
      <div className="sticky top-[100vh] px-6 py-2">
        <span className="mb-2 mr-2 inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700">
          Editions:
          {' '}
          {' '}
          {nft.total === undefined ? 'Not issued' : nft.total}
        </span>
        <span className="mb-2 mr-2 inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-primary-300">
          <a href={`https://relayx.com/token/${nft.origin}/owners`} target="_blank" rel="noopener noreferrer">
            Owners:
            {' '}
            {`${nft.owners}`}
          </a>
        </span>
        <span className="mb-2 mr-2 inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700">
          Floor Price:
          {' '}
          {nft.price === undefined ? 'None' : `${nft.price / 100000000} BSV`}
        </span>
      </div>
    </div>
  );
}

export default NFTCard;
