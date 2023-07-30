import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

interface SearchBarProps {
  path?: string;
}

function SearchBar({ path }: SearchBarProps) {
  const router = useRouter();
  const { query } = router;
  const [searchTerm, setSearchTerm] = useState(query.v || '');

  useEffect(() => {
    setSearchTerm(query.v || '');
  }, [query]);

  const handleChangeSearchTerm = (e:any) => {
    e.preventDefault();
    // router.push(`/search?q=${e.target.value}`)
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if(searchTerm.length > 0){
      router.push(`/search${path ? path : ""}?v=${searchTerm}`);
    }
  };

  const handleKeyUp = (e: any) => {
    e.preventDefault();
    const enterKey = 13;
    if (e.keyCode === enterKey) {
      console.log('typed enter', searchTerm);
      handleSubmit(e);
      // router.push(`/search?q=${searchTerm}`)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full px-4">
      <label htmlFor="search-term" className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white">Search</label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg aria-hidden="true" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input autoComplete='off' type="search" id="search-term" value={searchTerm} onChange={handleChangeSearchTerm} onKeyUp={handleKeyUp} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Search" />
      </div>
    </form>
  );
}

export default SearchBar;
