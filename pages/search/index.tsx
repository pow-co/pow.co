import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import moment from 'moment';
import ThreeColumnLayout from '../../components/ThreeColumnLayout';
import SearchBar from '../../components/SearchBar';
import UserIcon from '../../components/UserIcon';
import Meta from '../../components/Meta';
import Drawer from '../../components/Drawer';
import BoostPopup from '../../components/BoostpowButton/BoostPopup';

function SearchPage() {
  const router = useRouter();
  const { query } = router;
  const [boostPopupOpen, setBoostPopupOpen] = useState(false)
  const searchTerm = useMemo(() => query.q, [query]);


  return (
    <>
    <Meta title='Search | The Proof of Work Cooperative' description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
    <ThreeColumnLayout>
      <div className="col-span-12 min-h-screen lg:col-span-6">
        <div className="mb-[200px] w-full">
          <div className="mt-8">
            <div className="relative mb-4 flex flex-col">
              <SearchBar />
            </div>
          </div>
          <div className="mx-0 mt-5 flex px-4">
            <Link href="/search">
                <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md bg-primary-100 px-3 py-2 text-sm font-medium leading-4 text-gray-900 dark:bg-primary-600/20 dark:text-white">
                Boosted Content
                </div>
            </Link>
            <Link href="/search/twetch">
                <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-sm font-normal leading-4 text-gray-700 dark:text-gray-300">
                Twetch
                </div>
            </Link>
            <Link href="/search/slictionary">
                <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-sm font-normal leading-4 text-gray-700 dark:text-gray-300">
                Definitions
                </div>
            </Link>
          </div>
          <div className='mt-5 flex flex-col justify-center text-center'>
            <p className='text-5xl mb-3'>🚧</p>
            <p className='text-lg italic opacity-80 px-10'>This feature is not available yet. Help us know it is important for you by boosting this 👇</p>
            <button onClick={() => setBoostPopupOpen(true)} className='mt-5 mx-auto text-white font-semibold border-none rounded-md bg-gradient-to-tr from-primary-400 to-primary-500 cursor-pointer items-center text-center justify-center py-2 px-5 transition duration-500 transform hover:-translate-y-1'>wen search?</button>
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
    <Drawer
        selector='#boostPopupControler'
        isOpen={boostPopupOpen}
        onClose={() => setBoostPopupOpen(false)}
    >
        <BoostPopup content="d6b74ea02e0d074a9e0f9499d11802ed1dbf7bcd480235da8d53561f141a4eae" defaultTag='powco.dev' onClose={() => setBoostPopupOpen(false)} />
    </Drawer>
    </>
  );
}

export default SearchPage;
