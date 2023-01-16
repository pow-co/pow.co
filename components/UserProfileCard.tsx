import React, { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import { UserIcon } from '.'


const UserProfileCard = ({ me, numPosts, earned, itemsOwned, userProfileCard, isMe, followsMe, meFollows }) => {

  return (
    <div className="mt-2 max-w-screen">
        <div className="h-32 bg-gray-100 dark:bg-gray-600 w-full relative cursor-pointer overflow-hidden rounded-t-xl">
            <span className="box-border block overflow-hiden bg-none opacity-100 border-none m-0 p-0 absolute inset-0">
            <img
                src={userProfileCard.banner}
                decoding="async"
                className="h-32 bg-gray-100 rounded-t-xl relative cursor-pointer overflow-hidden  inset-0 box-border p-0 border-none m-auto block w-0 min-h-full max-h-full min-w-full max-w-full object-cover	object-center"
            />
            </span>
        </div>
        <div className="flex flex-col relative rounded-b-xl px-8 pb-8 bg-gray-100 dark:bg-gray-600">
            <div className="flex flex-row justify-between">
            <div className="-mt-8 mb-1.5 bg-gray-100 dark:bg-gray-600 h-16 w-16 rounded-full cursor-pointer">
                <UserIcon src={userProfileCard.icon} size={64} />
            </div>
            { (followsMe) && (
                <div className="mt-3 w-24 h-4 py-0.5 px-2 rounded-xl opacity-30 text-center text-xs font-semibold leading-3 bg-black dark:bg-white text-gray-300 dark:text-gray-700">
                Follows you
                </div>
            )} 
            </div>
            <div className="flex justify-start">
            <div className="grow ">
                <div className="flex flex-row items-center">
                <p className="text-base leading-5 font-bold text-gray-900 dark:text-white">
                    {userProfileCard.name}
                    <span className="ml-1 text-gray-500 dark:text-gray-300 font-normal">
                    @{userProfileCard.id}
                    </span>
                </p>
                </div>
                <a
                target="_blank"
                rel="noreferrer"
                href={`https://twetch.app/wallet/send?to=${userProfileCard.id}@twetch.me`}
                className="text-gray-700 dark:text-gray-300 text-xs leading-4 cursor-pointer inline-block"
                >
                {userProfileCard.id}@twetch.me
                </a>
            </div>
            <div className="text-gray-500 dark:text-gray-300 h-8 w-8 mr-4 rounded-md transition-all duration-150 ease-linear	flex justify-center items-center cursor-pointer relative fill-gray-700 dark:fill-gray-300">
                <svg
                viewBox="0 0 32 32"
                fill="none"
                className="fill-inherit	h-8 w-8"
                width="auto"
                height="16"
                >
                <path d="M11.0617 23.3899C12.0141 23.3899 13.9612 22.4305 15.3933 21.4146C20.3104 21.5486 24 18.7197 24 15.023C24 11.4745 20.4444 8.61035 16 8.61035C11.5556 8.61035 8 11.4745 8 15.023C8 17.337 9.48148 19.3899 11.7108 20.4199C11.3933 21.0407 10.8007 21.8731 10.4832 22.2894C10.1093 22.7761 10.3351 23.3899 11.0617 23.3899ZM11.8025 22.2188C11.746 22.24 11.7249 22.1977 11.7601 22.1553C12.1552 21.6686 12.7196 20.9349 12.9594 20.4763C13.157 20.1165 13.1076 19.792 12.6561 19.5804C10.4409 18.5504 9.17108 16.9066 9.17108 15.023C9.17108 12.1377 12.1975 9.78143 16 9.78143C19.8095 9.78143 22.836 12.1377 22.836 15.023C22.836 17.9155 19.8095 20.2717 16 20.2717C15.8589 20.2717 15.6402 20.2647 15.358 20.2576C15.0617 20.2506 14.836 20.3493 14.5679 20.561C13.7002 21.1888 12.4444 21.9578 11.8025 22.2188Z"></path>
                </svg>
            </div>
                {meFollows ? <button className="h-8 text-white text-sm leading-4 font-semibold p-4  border-none rounded-md bg-gradient-to-r from-sky-500 to-indigo-500 cursor-pointer flex items-center text-center justify-content">
                Following
                </button>: isMe ? <></>:<button className="h-8 text-sm leading-4 font-semibold p-4  rounded-md border border-solid border-blue-500 cursor-pointer flex items-center text-center justify-content">
                Follow
                </button>}
            </div>
            {userProfileCard.description && (
            <p className="text-base leading-5 text-gray-900 dark:text-white mt-4 mb-3">
                {userProfileCard.description}
            </p>
            )}
            {userProfileCard.profileUrl && (
            <div className="mt-1.5 flex items-center">
                <svg
                viewBox="0 0 16 18"
                fill="none"
                className="fill-gray-500 dark:fill-gray-300 opacity-50 w-4 h-3"
                >
                    <path d="M7.90569 12.108L8.90911 11.0895C7.91324 11.014 7.26441 10.7122 6.77402 10.2218C5.45373 8.90156 5.46128 7.03053 6.76647 5.72533L9.22598 3.26582C10.5463 1.95308 12.4022 1.94553 13.7225 3.26582C15.0428 4.58611 15.0277 6.4496 13.7225 7.7548L12.2438 9.23352C12.455 9.71637 12.5003 10.2747 12.4248 10.7651L14.6429 8.55452C16.4461 6.74384 16.4612 4.18625 14.6354 2.35294C12.8021 0.519624 10.2369 0.534713 8.42626 2.34539L5.85359 4.92561C4.04291 6.73629 4.02782 9.30142 5.86113 11.1272C6.33644 11.6025 6.94 11.942 7.90569 12.108ZM8.09431 5.89131L7.09089 6.90981C8.08676 6.9928 8.73559 7.28704 9.22598 7.77743C10.5463 9.09772 10.5387 10.9688 9.23353 12.274L6.76647 14.7335C5.45373 16.0462 3.59778 16.0537 2.2775 14.741C0.95721 13.4132 0.964754 11.5572 2.2775 10.2445L3.75622 8.76576C3.54497 8.29046 3.49216 7.72462 3.57515 7.23423L1.35707 9.44477C-0.446067 11.2554 -0.461156 13.8206 1.36461 15.6463C3.19793 17.4797 5.76306 17.4646 7.56619 15.6614L10.1464 13.0737C11.9571 11.263 11.9722 8.69786 10.1389 6.87209C9.66356 6.39679 9.06 6.05729 8.09431 5.89131Z"></path>
                </svg>
                <a
                target="_blank"
                rel="noreferrer"
                href={userProfileCard.profileUrl}
                className="mx-1 text-ellipsis overflow-hidden text-blue-500 inline-block text-base font-normal leading-5	tracking-normal	 text-left hover:underline"
                >
                {userProfileCard.profileUrl.slice(8)}
                </a>
            </div>
            )}
            {userProfileCard.twitterHandle && (
            <div className="mt-1.5 flex items-center">
                <svg
                viewBox="0 0 20 16"
                fill="none"
                className="opacity-50 fill-gray-500 dark:fill-gray-300 w-4 h-3"
                >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.91836 11.0517L9.96033 11.7437C10.0862 13.5374 8.98106 15.1757 7.23236 15.8113C6.58884 16.0373 5.49765 16.0655 4.78418 15.8678C4.50439 15.783 3.97278 15.5006 3.59506 15.2463L2.90957 14.7803L2.15414 15.0204C1.73445 15.1475 1.17486 15.3593 0.923052 15.5006C0.685228 15.6277 0.475386 15.6983 0.475386 15.6559C0.475386 15.4158 0.993 14.5967 1.42668 14.1447C2.01424 13.5092 1.84637 13.4527 0.65725 13.8764C-0.0562189 14.1165 -0.0702074 14.1165 0.0696871 13.8481C0.153626 13.7069 0.587301 13.2126 1.04896 12.7606C1.83237 11.9838 1.87434 11.8991 1.87434 11.2494C1.87434 10.2467 2.34999 8.15641 2.82564 7.01242C3.70698 4.86567 5.59558 2.6483 7.48417 1.53255C10.1422 -0.0351418 13.6816 -0.430596 16.6613 0.487424C17.6546 0.798138 19.3613 1.58905 19.3613 1.73028C19.3613 1.77265 18.8437 1.82914 18.2142 1.84327C16.8992 1.87151 15.5841 2.23872 14.465 2.8884L13.7095 3.34034L14.5769 3.63693C15.808 4.06064 16.9132 5.03515 17.1929 5.95317C17.2769 6.24976 17.2489 6.26388 16.4655 6.26388L15.6541 6.27801L16.3396 6.60284C17.151 7.01242 17.8924 7.70447 18.2562 8.41063C18.522 8.91908 18.8577 10.2043 18.7598 10.3032C18.7318 10.3455 18.438 10.2608 18.1023 10.1478C17.137 9.79472 17.0111 9.87946 17.5707 10.4726C18.6199 11.546 18.9416 13.142 18.438 14.6532L18.2002 15.3311L17.2769 14.4131C15.3883 12.5629 13.1639 11.4613 10.6178 11.1364L9.91836 11.0517ZM6.07975 13.9927L5.33473 13.9927L4.60286 12.9234L3.86661 13.9927L3.12597 13.9927L4.18653 12.4939L3.19171 11.0696L3.93235 11.0696L4.60286 12.0688L5.26461 11.0696L6.01401 11.0696L5.01919 12.4895L6.07975 13.9927Z"
                ></path>
                </svg>

                <a
                target="_blank"
                rel="noreferrer"
                href={`https://twitter.com/${userProfileCard.twitterHandle}`}
                className="mx-1 text-blue-500 inline-block text-base font-normal leading-5	tracking-normal	 text-left hover:underline"
                >
                {userProfileCard.twitterHandle}
                </a>
            </div>
            )}
            <div className="">
            <div className="flex mt-4">
                <p className="cursor-pointer leading-5 font-semibold text-gray-700 dark:text-gray-300 mr-5 hover:underline">
                {userProfileCard.followerCount}
                <span className="ml-1 text-normal">Followers</span>
                </p>
                <p className="cursor-pointer leading-5 font-semibold text-gray-700 dark:text-gray-300 mr-5 hover:underline">
                {userProfileCard.followingCount}
                <span className="ml-1 text-normal">Following</span>
                </p>
            </div>
            </div>
        </div>
         <div className=''>
            <div className='mt-4 bg-gray-100 dark:bg-gray-600 rounded-lg flex py-5 lg:py-8 px-4 lg:px-6'>
                <div className=''>
                    <p className='text-lg font-semibold text-center text-gray-700 dark:text-gray-400'>{numPosts}</p>
                    <p className='font-sm text-center text-gray-500 dark:text-gray-300'>Twetches</p>
                </div>
                <div className='grow'/>
                <div className=''>
                    <p className='text-lg font-semibold text-center text-gray-700 dark:text-gray-400'>{itemsOwned}</p>
                    <p className='font-sm text-center text-gray-500 dark:text-gray-300'>Items Owned</p>
                </div>
                <div className='grow'/>
                <div className=''>
                    <p className='text-lg font-semibold text-center text-blue-500'>${earned}</p>
                    <p className='font-sm text-center text-gray-500 dark:text-gray-300'>Earned</p>
                </div>
            </div>
            {isMe && <div className='mt-4 bg-gray-100 dark:bg-gray-600 p-4 rounded-lg'>
                <p className='text-xs text-gray-500 dark:text-gray-300'>Invite friends, earn money</p>
                <Link href="/invite">
                    <div className='mt-4 cursor-pointer flex items-center rounded-md bg-gray-300 dark:bg-gray-800 border-none  p-4  w-full max-w-full'>
                        <p className='text-xs leading-4 mr-2.5'>{me.referralLinkByReferralLinkId.shortLinkUrl}</p>
                        <div className='grow'/>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                </Link>
            </div>}
            </div>
    </div>
  )
}

export default UserProfileCard