import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import {
  ThreeColumnLayout,
  Loader,
  SimplePostCard,
  QuestionCard,
  Placeholder,
  Composer,
  PostCard,
  OnchainPostCard,
} from ".";
import InfiniteScroll from "react-infinite-scroll-component";
import { getLocalFeed, getLocalFeedPagination } from "../services";
import Link from "next/link";
import { useRelay } from "../context/RelayContext";
import { useAPI } from "../hooks/useAPI";

import moment from "moment";
import { useTuning } from "../context/TuningContext";
import { useRouter } from "next/router";
import { useBitcoin } from "../context/BitcoinContext";

import { FormattedMessage } from 'react-intl';

function ago(period) {
  return moment().subtract(1, period).unix() * 1000;
}

const Dashboard = ({ data, recent, error, loading }) => {
  const router = useRouter();
  const { authenticated } = useBitcoin();
  const { startTimestamp, tag, setTag, filter,setFilter } = useTuning();
  console.log(data,recent)

  const handleChangeTab = (tag) => {
    switch (tag) {
      case "":
        router.push("/");
        break;
      //case "1F9E9":
      case "question":
        router.push("/questions");
        break;
      //case "1F4A1":
      case "answer":
        router.push("/answers");
        break;
      //case "1F48E":
      case "project":
        router.push("/projects");
        break;
      case "test":
        router.push("/test");
        break;
      default:
        console.log("unknown tag");
    }
  };

  const handleChange = (e) => {
    e.preventDefault()
    setFilter(e.target.value)
  }

  return (
    <ThreeColumnLayout>
      <div className="col-span-12 lg:col-span-6 min-h-screen">
        {tag !== "answer" && (
          <div className="hidden lg:block mt-8">
            <Composer />
          </div>
        )}
        <div className="px-4 mt-2">
          <div className="flex my-6">
            <div className="flex">
              {/* <div
                onClick={() => handleChangeTab("")}
                className={
                  tag === ""
                    ? "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 font-medium mr-2 cursor-pointer rounded-md whitespace-nowrap"
                    : "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 font-normal mr-2 cursor-pointer rounded-md whitespace-nowrap"
                }
              >
                All 🦚
              </div> */}
              <div
                //onClick={() => handleChangeTab("1F9E9")}
                onClick={() => handleChangeTab("question")}
                className={
                  //tag === "1F9E9"
                  tag === "question"
                    ? "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 font-medium mr-2 cursor-pointer rounded-md whitespace-nowrap"
                    : "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 font-normal mr-2 cursor-pointer rounded-md whitespace-nowrap"
                }
              >
                <FormattedMessage id="Questions"/>
              </div>
              <div
                //onClick={() => handleChangeTab("1F4A1")}
                onClick={() => handleChangeTab("answer")}
                className={
                  //tag === "1F4A1"
                  tag === "answer"
                    ? "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 font-medium mr-2 cursor-pointer rounded-md whitespace-nowrap"
                    : "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 font-normal mr-2 cursor-pointer rounded-md whitespace-nowrap"
                }
              >
                <FormattedMessage id="Answers"/>
              </div>
              {/* <div
                //onClick={() => handleChangeTab("1F48E")}
                onClick={() => handleChangeTab("project")}
                className={
                  //tag === "1F48E"
                  tag === "project"
                    ? "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 font-medium mr-2 cursor-pointer rounded-md whitespace-nowrap"
                    : "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 font-normal mr-2 cursor-pointer rounded-md whitespace-nowrap"
                }
              >
                Experiments 💎
              </div> */}
              {/* <div
                  onClick={() => handleChangeTab("test")}
                  className={
                    tag === "test"
                      ? "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 font-medium mr-2 cursor-pointer rounded-md whitespace-nowrap"
                      : "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 font-normal mr-2 cursor-pointer rounded-md whitespace-nowrap"
                  }
                >
                  Tests 🐛
                </div> */}
            </div>
          </div>
        </div>

        <div className="mb-5 sm:hidden px-5">
          <div className='flex items-center'>
            <select value={filter} onChange={handleChange} id="filter" className="ml-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block grow p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="last-hour"><FormattedMessage id="Last Hour"/></option>
            <option value="last-day"><FormattedMessage id="Last Day"/></option>
            <option value="last-week"><FormattedMessage id="Last Week"/></option>
            <option value="last-month"><FormattedMessage id="Last Month"/></option>
            <option value="last-year"><FormattedMessage id="Last Year"/></option>
            <option value="all-time"><FormattedMessage id="All"/></option>
            </select>
          </div>
        </div>

        <div className="w-full">
          <div className="relative">
            {/* <InfiniteScroll
                dataLength={posts.length}
                hasMore={hasMore}
                next={fetchMore}
                loader={<Loader />}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                refreshFunction={refresh}
              >
              </InfiniteScroll> */}
            
            {!loading &&
              !error &&
              data?.map((post) => {
                if (post.txid) {
                  return <OnchainPostCard key={post.txid} post={post} />;
                } else {
                  return <SimplePostCard key={post.tx_id} post={post} />;
                }
              })}
            {loading && <Loader />}
            {!loading && recent && (
              <div className="flex py-5 items-center">
                <div className="grow border border-bottom border-gray-600 dark:border-gray-300" />
                <div className="mx-5 font-semibold text-gray-600 dark:text-gray-300 text-lg"><FormattedMessage id="Recent"/></div>
                <div className="grow border border-bottom border-gray-600 dark:border-gray-300" />
              </div>
            )}
            {recent?.map((post) => (
              <SimplePostCard key={post.tx_id} post={post} />
            ))}
            {/* {!recentLoading &&
                !recentError &&
                recent.questions.map((post) => (
                  <QuestionCard key={post.tx_id} post={post} />
                ))} */}
          </div>
        </div>
        {authenticated && (
          <Link href="/compose">
            <div className=" lg:hidden fixed bottom-[73px] right-[14px] h-14 w-14 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          </Link>
        )}
      </div>
    </ThreeColumnLayout>
  );
};

export default Dashboard;
