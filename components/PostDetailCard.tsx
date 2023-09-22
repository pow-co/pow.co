'use client'
import React, { useEffect } from 'react'
import { TransactionDetails, URLPreview } from '../app/t/[txid]/page'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import UserIcon from './UserIcon'
import moment from 'moment'
import ContentText from './ContentText'
import BoostButton from './v13_BoostpowButton/BoostButton'

interface PostDetailCardProps {
    details: TransactionDetails
}
const PostDetailCard = ({details}:PostDetailCardProps) => {
    const router = useRouter()
    const gradient = "from-pink-400 to-violet-600";
    
    useEffect(() => {
        console.log(details)
    },[])
    
  return (
    <div
      className="mt-0.5 grid grid-cols-12 bg-primary-100 dark:bg-primary-600/20  first:md:rounded-t-lg last:md:rounded-b-lg"
    >
        <div className='col-span-12 px-4 pt-4'>
            <p className='text-2xl font-semibold'>
                <span className={`bg-gradient-to-br bg-clip-text text-transparent ${gradient}`}>{details.difficulty?.toFixed(4)}</span>
                <span className="ml-1">⛏️</span>
            </p>
        </div>
        <div className="col-span-12 max-w-screen mb-0.5 grid grid-cols-12 items-start px-4 pt-4">
            <div className="col-span-1 flex h-full w-full flex-col justify-start">
                {details.author?.paymail && (
                    <Link
                        className="justify-start"
                        onClick={(e: any) => e.stopPropagation()}
                        href={`/profile/${details.author.paymail}`}
                    >
                        <UserIcon src={details.author.avatar!} size={46}/>
                    </Link>
                )}
            </div>
            <div className='col-span-11 ml-6'>
                <div className='flex'>
                    <div className='truncate'>
                        {details.author?.paymail && (
                            <Link href={`/profile/${details.author.paymail}`} onClick={(e: any) => e.stopPropagation()}>
                                <p>
                                    <span className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap font-bold  text-gray-900 hover:underline dark:text-white">
                                        {details.author.name}
                                    </span>
                                    <span className="ml-1 text-sm font-semibold text-gray-400 hover:underline dark:text-gray-600">
                                        {details.author.paymail}
                                    </span>
                                </p>
                            </Link>
                        )}
                    </div>
                    <div className='grow'/>
                    <a
                        onClick={(e: any) => e.stopPropagation()}
                        target="_blank"
                        rel="noreferrer"
                        href={`https://whatsonchain.com/tx/${details.txid}`}
                        className="whitespace-nowrap text-xs leading-5 text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:dark:text-gray-500"
                        id={`_${details.txid}`}
                    >
                        {moment(details.createdAt!).fromNow()}
                    </a> 
                </div>
                {details.textContent && <ContentText content={details.textContent}/>}
                {details.files && details.files?.length > 0 && (
                    <div
                    className="grid grid-gap-0.5 gap-0.5 mt-2 rounded-xl select-none overflow-hidden"
                    style={{
                        gridTemplateColumns: `repeat(${
                        details.files!.length > 1 ? "2" : "1"
                        }, 1fr)`,
                    }}
                    >
                    {details.files!.map((media: any, index: number) => (
                        <div
                        id={`media_${media.txid? media.txid : details.txid}_${index.toString()}`}
                        className="relative rounded-xl overflow-hidden"
                        >
                            <div className="h-full">
                                <img
                                    src={media.txid? `https://dogefiles.twetch.app/${media.txid}` : `data:${media.contentType};base64,${media.content}`}
                                    className="rounded-xl h-full w-full grid object-cover"
                                />
                            </div>
                        </div>
                    ))}
                    </div>
                )}
                {details.urls?.map((linkUnfurl: URLPreview) => (
                    <a
                    onClick={(e:any) => e.stopPropagation()}
                    href={linkUnfurl.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 rounded-xl bg-primary-100 dark:bg-primary-900/20 relative flex flex-col"
                    >
                    <img
                        src={linkUnfurl.image}
                        className="rounded-t-xl max-w-full object-cover "
                    />
                    <div
                        className={`bg-primary-300 dark:bg-primary-700 py-3 px-4 ${
                        linkUnfurl.image ? "rounded-b-xl" : "rounded-xl"
                        }`}
                    >
                        <div className="h-[46px] flex flex-col justify-center">
                        <p className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                            {linkUnfurl.description}
                        </p>
                        <p className="text-xs mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
                            {linkUnfurl.url}
                        </p>
                        </div>
                    </div>
                    </a>
                ))}
            </div>
        </div>
        <div className='col-span-12 flex w-full px-16'>
            <div className='grow'/>
            <div className="group relative flex w-fit min-w-[111px] items-center justify-center">
                <svg
                    viewBox="0 0 40 40"
                    fill="none"
                    className="h-[40px] w-[40px] fill-gray-500 group-hover:fill-green-500 dark:fill-gray-300"
                >
                    <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.7698 26.04L16.7796 26.0214C16.8013 25.98 16.8245 25.9351 16.8491 25.8873C17.03 25.5371 17.2911 25.0314 17.6274 24.6275C18.0608 24.1068 18.7281 23.6137 19.6907 23.6137C22.7525 23.6137 24.8033 23.173 26.0492 22.4503C27.1805 21.794 27.7035 20.8819 27.7035 19.5258C27.7035 16.3261 24.3811 13.2965 19.6907 13.2965C15.2771 13.2965 12.2965 16.1275 12.2965 19.5258C12.2965 20.3629 12.6319 22.2529 13.4911 23.5026L13.4978 23.5125L13.4978 23.5125C14.3586 24.7897 15.3301 25.7902 16.4883 26.5864C16.5026 26.5622 16.5179 26.5356 16.5341 26.5064C16.6042 26.3801 16.6748 26.2365 16.7606 26.059L16.7698 26.04ZM17.9278 26.6233C17.9537 26.574 17.9795 26.5244 18.0053 26.4748C18.4108 25.6944 18.8183 24.9101 19.6907 24.9101C25.9691 24.9101 29 23.1358 29 19.5258C29 15.3652 24.8247 12 19.6907 12C14.7423 12 11 15.2428 11 19.5258C11 20.5354 11.3711 22.7075 12.4227 24.2371C13.4124 25.7055 14.5567 26.8681 15.9485 27.7858C16.1649 27.9388 16.3814 28 16.5979 28C17.2474 28 17.5876 27.327 17.9278 26.6233Z"
                    />
                </svg>
                <p className="text-gray-500 group-hover:text-green-500 dark:text-gray-300">
                    {details.replies?.length || 0}
                </p>
            </div>
            <BoostButton
                content={details.txid}
                difficulty={details.difficulty || 0}
                existingTags={details.tags?.map((tag) => tag.utf8)}
            />
        </div>
        <div className="col-span-12 flex w-full flex-wrap overflow-hidden px-4 pb-4">
        {details.tags?.map((tag: any, index: number) => {
          if (
            tag.hex !== "0000000000000000000000000000000000000000" &&
            tag.utf8?.length > 0
          ) {
            return (
              <Link
                key={`tag_${details.txid}_${index}`}
                onClick={(e: any) => e.stopPropagation()}
                href={`/topics/${tag.utf8}`}
              >
                <div className="mr-2 mt-2 flex items-center rounded-full bg-primary-500 p-2 text-sm font-bold text-white">
                  {tag.utf8}{" "}
                  <span className="ml-2">
                    ⛏️ {Math.round(tag.difficulty)}
                  </span>
                </div>
              </Link>
            );
          }
        })}
      </div>
    </div>
  )
}

export default PostDetailCard