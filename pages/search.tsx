import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import moment from 'moment';
import ThreeColumnLayout from '../components/ThreeColumnLayout';
import SearchBar from '../components/SearchBar';
import UserIcon from '../components/UserIcon';
import Meta from '../components/Meta';

function DefinitionItem(props: any) {
  const {
    author, createDate, definition, etymology, id, usage, word,
  } = props;
  const [avatar, setAvatar] = useState('');
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    switch (true) {
      case author.includes('relayx'):
        setAvatar(`https://a.relayx.com/u/${author}`);
        break;
      case author.includes('twetch'):
        setAvatar(`https://auth.twetch.app/api/v2/users/${author.split('@')[0]}/icon`);
        break;
      case author.includes('handcash'):
        setAvatar(`https://cloud.handcash.io/v2/users/profilePicture/${author.split('@')[0]}`);
        break;
      default:
        setAvatar('');
    }
  }, []);
  return (
    <div key={id} className="mt-0.5 grid grid-cols-12 bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 first:md:rounded-t-lg last:md:rounded-b-lg">
      <div className="max-w-screen col-span-12 mb-0.5 grid cursor-pointer grid-cols-12 items-start px-4 pt-4">
        <div className="col-span-1">
          <Link onClick={(e:any) => e.stopPropagation()} href={`/profile/${author}`}>
            <UserIcon src={avatar} size={46} />
          </Link>
        </div>
        <div className="col-span-11 ml-4">
          <div className="flex">
            <Link
              href={`/profile/${author}`}
              onClick={(e:any) => e.stopPropagation()}
              className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold leading-4 text-gray-900 hover:underline dark:text-white"
            >
              {author}
            </Link>
            <div className="grow" />
            <p className="whitespace-nowrap text-xs leading-5 text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:dark:text-gray-500">
              {moment(createDate).fromNow()}
            </p>
            <a href={`https://slictionary.com/w?=${word}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
              <div className="ml-4 flex h-5 w-5 items-center text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:dark:text-gray-500">
                <img className="rounded-full" src="https://slictionary.com/favicon.ico" />
              </div>
            </a>
          </div>
          <div className="col-span-11">
            <p>{definition}</p>
          </div>
        </div>
        <button type="button" className="col-span-12 font-bold text-primary-500 hover:underline" onClick={() => setExpand(!expand)} onKeyDown={() => setExpand(!expand)}>
          Show
          {!expand ? 'More' : 'Less'}
        </button>
        {expand && (
          <>
            <div className="col-span-1" />
            <div className="col-span-11 ml-4">
              {etymology?.length > 0 && (
              <div className="py-2">
                <p className="font-bold">Etymology:</p>
                <p className="text-sm">{etymology}</p>
              </div>
              )}
              {usage?.length > 0 && (
              <div className="py-2">
                <p className="font-bold">Usage:</p>
                <p className="text-sm">{usage}</p>
              </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SearchPage() {
  const router = useRouter();
  const { query } = router;
  const [definitions, setDefinitions] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const searchTerm = useMemo(() => query.q, [query]);

  useEffect(() => {
    setDefinitions([]);
    setNotFound(false);
    axios.get(`https://us-central1-slictionary-fc2a0.cloudfunctions.net/word/doc/${searchTerm}`).then((res) => {
      if (res.data.definitions) {
        setDefinitions(res.data.definitions[0].defVersions);
      } else {
        setNotFound(true);
      }
    }).catch((reason) => {
      console.log(reason);
    });
  }, [searchTerm]);

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
            <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-sm font-normal leading-4 text-gray-700 dark:text-gray-300">
              Boosted Content
            </div>
            <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md bg-primary-100 px-3 py-2 text-sm font-medium leading-4 text-gray-900 dark:bg-primary-600/20 dark:text-white">
              Definitions
            </div>
          </div>
          <div className="mt-5">
            {definitions.map((defItem: any) => (
              <DefinitionItem key={defItem.id} {...defItem} word={searchTerm} />
            ))}
            {notFound && (
            <div className="flex flex-col items-center text-center">
              <p className="text-5xl">🔎</p>
              <p className="text-xl font-semibold">{`"${searchTerm}" has no definition yet on SLictionary`}</p>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://slictionary.com/createword/@/@/@"
                className="mb-6 mt-12 cursor-pointer items-center justify-center rounded-md border-none bg-gradient-to-tr from-blue-400 to-blue-500 px-5 py-2 text-center text-sm font-semibold leading-4 text-white transition duration-500 hover:-translate-y-1"
              >
                Mint a definition on SLictionary.com
                <span className="ml-1 font-extrabold">now</span>
              </a>
            </div>
            )}
          </div>
          {/* <div>
                    Results
                </div> */}
        </div>
      </div>

    </ThreeColumnLayout>
    </>
  );
}

export default SearchPage;
