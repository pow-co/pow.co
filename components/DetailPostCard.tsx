import React from 'react'
import { UserIcon, PostDescription, PostMedia } from '.'
import Link from 'next/link'
import { useRouter } from 'next/router'
import moment from 'moment'
import likeTwetch from '../services/twetch/like-twetch'
import BoostButton from './BoostButton'
import { useEffect } from 'react'
import { useTuning } from '../context/TuningContext'

import Linkify from "linkify-react";


const DetailPostCard = ({ post, difficulty }) => {
    const router = useRouter();

    const { zenMode } = useTuning();

  const navigate = (e) => {
    e.stopPropagation();
    if(post.answers){
      router.push(`/questions/${post.tx_id}`)
    } else {
      router.push(`/answers/${post.tx_id}`)
    }
  } 

  const handleLike = (e) => {

  }
  if (!post){
    return <></>
  } else {
  return (
      <div onClick={navigate}  className='grid grid-cols-12 bg-gray-100 dark:bg-gray-600 hover:sm:bg-gray-200 hover:dark:sm:bg-gray-500 mt-0.5 first:rounded-t-lg'>
        <div className='col-span-12'>
          <div className='mb-0.5 px-4 pt-4 pb-1 grid items-start grid-cols-12 max-w-screen cursor-pointer'>
            {!zenMode && <div className='col-span-1'>
              {/* <Link  href={`/u/${post.userId}`}>
                <a onClick={(e)=>e.stopPropagation()}>
                  <UserIcon src={post.userByUserId.icon} size={46}/>
                </a>
              </Link> */}
              <a>
              <UserIcon src={`https://bitpic.network/u/0`} size={46}/>
              </a>
            </div>}
            <div className={`col-span-${zenMode ? 12 : 11} ml-6`}>
              {!zenMode && <div className='flex'>
                {/* <Link  href={`/u/${post.userId}`}>
                  <div onClick={(e)=>e.stopPropagation()} className='text-base leading-4 font-bold text-gray-900 dark:text-white cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis	hover:underline'>
                    {post.userByUserId.name}<span className='ml-1 font-normal text-gray-500 dark:text-gray-300'>@{post.userId}</span>
                  </div>
                </Link> */}
               <div onClick={(e)=>e.stopPropagation()} className='text-base leading-4 font-bold text-gray-900 dark:text-white cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis	hover:underline'>
                    1anon
                  </div>
                  
                <div className='grow'/>
                <a target="_blank" rel="noreferrer" href={`https://whatsonchain.com/tx/${post.tx_id}`} className='text-xs leading-5 whitespace-nowrap text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:dark:text-gray-500'>
                  {moment(post.createdAt).fromNow()}
                </a>
                {/* <a href={`https://twetch.com/t/${post.tx_id}`} target="_blank" rel="noreferrer" onClick={(e)=>e.stopPropagation()}>
                  <div className='flex items-center ml-4 h-5 w-5 text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:dark:text-gray-500'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg> 
                    <svg viewBox="0 0 102 110" className="bg-gray-700 dark:bg-transparent rounded p-1">
                      <path d="M3.66391 55.0011C-1.39212 46.1876 -1.04744 35.7272 3.66391 27.5017C8.37755 35.7272 8.72222 46.1876 3.66391 55.0011ZM3.66391 55.0011C-1.04744 63.2266 -1.39212 73.6871 3.66391 82.5006C8.72222 73.6871 8.37755 63.2266 3.66391 55.0011ZM51.0011 0C46.2898 8.22548 45.9451 18.6859 51.0011 27.4994C56.0572 18.6859 55.7125 8.22548 51.0011 0ZM51.0011 27.5017C46.2898 35.7272 45.9451 46.1876 51.0011 55.0011C56.0572 46.1876 55.7125 35.7272 51.0011 27.5017ZM51.0011 55.0011C46.2898 63.2266 45.9451 73.6871 51.0011 82.5006C56.0572 73.6871 55.7125 63.2266 51.0011 55.0011ZM51.0011 82.5006C46.2898 90.7261 45.9451 101.186 51.0011 110C56.0572 101.186 55.7125 90.7261 51.0011 82.5006ZM98.3361 27.5017C93.6247 35.7272 93.2801 46.1876 98.3361 55.0011C103.392 46.1876 103.047 35.7272 98.3361 27.5017ZM98.3361 55.0011C93.6247 63.2266 93.2801 73.6871 98.3361 82.5006C103.392 73.6871 103.047 63.2266 98.3361 55.0011ZM27.3325 13.7497C32.3908 22.5655 41.5647 27.4925 51.0011 27.4994C46.2761 19.2808 37.4469 13.7497 27.3325 13.7497ZM27.3325 13.7497C37.4469 13.7497 46.2761 8.21859 51.0011 0C41.5647 0.00689093 32.3908 4.93621 27.3325 13.7497ZM27.3325 13.7497C22.2765 22.5655 22.6212 33.026 27.3325 41.2514C32.0462 33.026 32.3908 22.5655 27.3325 13.7497ZM3.66619 27.4994C13.1026 27.4925 22.2765 22.5632 27.3325 13.7497C17.2182 13.7497 8.38896 19.2808 3.66619 27.4994ZM74.6675 13.7497C79.7258 22.5655 88.8997 27.4925 98.3361 27.4994C93.611 19.2808 84.7818 13.7497 74.6675 13.7497ZM74.6675 13.7497C69.6114 22.5655 69.9561 33.026 74.6675 41.2514C79.3811 33.026 79.7258 22.5655 74.6675 13.7497ZM51.0011 27.4994C60.4375 27.4925 69.6114 22.5632 74.6675 13.7497C64.5531 13.7497 55.7239 19.2808 51.0011 27.4994ZM51.0011 0C55.7239 8.21859 64.5554 13.7497 74.6675 13.7497C69.6114 4.93621 60.4375 0.00689093 51.0011 0ZM27.3325 41.2491C32.3908 50.0649 41.5647 54.992 51.0011 54.9989C46.2761 46.7803 37.4469 41.2491 27.3325 41.2491ZM27.3325 41.2491C37.4469 41.2491 46.2761 35.718 51.0011 27.4994C41.5647 27.5063 32.3908 32.4356 27.3325 41.2491ZM27.3325 41.2491C22.2765 50.0649 22.6212 60.5254 27.3325 68.7509C32.0462 60.5254 32.3908 50.0649 27.3325 41.2491ZM3.66619 55.0011C13.1026 54.9943 22.2765 50.0649 27.3325 41.2514C17.2182 41.2491 8.38896 46.7803 3.66619 55.0011ZM3.66619 27.4994C8.38896 35.718 17.2205 41.2491 27.3325 41.2491C22.2765 32.4356 13.1003 27.5063 3.66619 27.4994ZM74.6675 41.2491C79.7258 50.0649 88.8997 54.992 98.3361 54.9989C93.611 46.7803 84.7818 41.2491 74.6675 41.2491ZM74.6675 41.2491C84.7818 41.2491 93.611 35.718 98.3361 27.4994C88.8997 27.5063 79.7258 32.4356 74.6675 41.2491ZM74.6675 41.2491C69.6114 50.0649 69.9561 60.5254 74.6675 68.7509C79.3811 60.5254 79.7258 50.0649 74.6675 41.2491ZM51.0011 55.0011C60.4375 54.9943 69.6114 50.0649 74.6675 41.2514C64.5531 41.2491 55.7239 46.7803 51.0011 55.0011ZM51.0011 27.4994C55.7239 35.718 64.5554 41.2491 74.6675 41.2491C69.6114 32.4356 60.4375 27.5063 51.0011 27.4994ZM27.3325 68.7509C32.3908 77.5667 41.5647 82.4937 51.0011 82.5006C46.2761 74.282 37.4469 68.7509 27.3325 68.7509ZM27.3325 68.7509C37.4469 68.7509 46.2761 63.2197 51.0011 55.0011C41.5647 55.008 32.3908 59.9351 27.3325 68.7509ZM27.3325 68.7509C22.2765 77.5667 22.6212 88.0271 27.3325 96.2526C32.0462 88.0248 32.3908 77.5644 27.3325 68.7509ZM3.66619 82.5006C13.1026 82.4937 22.2765 77.5644 27.3325 68.7509C17.2182 68.7509 8.38896 74.282 3.66619 82.5006ZM3.66619 55.0011C8.38896 63.2197 17.2205 68.7509 27.3325 68.7509C22.2765 59.9351 13.1003 55.008 3.66619 55.0011ZM74.6675 68.7509C79.7258 77.5667 88.8997 82.4937 98.3361 82.5006C93.611 74.282 84.7818 68.7509 74.6675 68.7509ZM74.6675 68.7509C84.7818 68.7509 93.611 63.2197 98.3361 55.0011C88.8997 55.008 79.7258 59.9351 74.6675 68.7509ZM74.6675 68.7509C69.6114 77.5667 69.9561 88.0271 74.6675 96.2526C79.3811 88.0248 79.7258 77.5644 74.6675 68.7509ZM51.0011 82.5006C60.4375 82.4937 69.6114 77.5644 74.6675 68.7509C64.5531 68.7509 55.7239 74.282 51.0011 82.5006ZM51.0011 55.0011C55.7239 63.2197 64.5554 68.7509 74.6675 68.7509C69.6114 59.9351 60.4375 55.008 51.0011 55.0011ZM27.3325 96.2503C32.3908 105.066 41.5647 109.993 51.0011 110C46.2761 101.781 37.4469 96.2503 27.3325 96.2503ZM27.3325 96.2503C37.4469 96.2503 46.2761 90.7192 51.0011 82.5006C41.5647 82.5075 32.3908 87.4368 27.3325 96.2503ZM3.66619 82.5006C8.38896 90.7192 17.2205 96.2503 27.3325 96.2503C22.2765 87.4368 13.1003 82.5075 3.66619 82.5006ZM74.6675 96.2503C84.7818 96.2503 93.611 90.7192 98.3361 82.5006C88.8997 82.5075 79.7258 87.4368 74.6675 96.2503ZM51.0011 110C60.4375 109.993 69.6114 105.064 74.6675 96.2503C64.5531 96.2503 55.7239 101.781 51.0011 110ZM51.0011 82.5006C55.7239 90.7192 64.5554 96.2503 74.6675 96.2503C69.6114 87.4368 60.4375 82.5075 51.0011 82.5006Z" fill="white"></path>
                    </svg>
                  </div>
                </a> */}
              </div>}
              {post.question !== undefined && (
                <div onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/questions/${post.question.tx_id}`)
                }} className='cursor-pointer relative flex flex-col bg-gray-300 dark:bg-gray-700 m-4 p-4 border-l-4 border-gray-500 '>
                  <span className='w-9 h-9 flex items-center justify-center text-center absolute -top-4 -left-4 rounded-full bg-gray-100 dark:bg-gray-600'>🧩</span>
                  <Linkify><PostDescription bContent={post.question.content}/></Linkify>
                </div>
              )}
              <Linkify><PostDescription bContent={post.content}/></Linkify>
              {/* <PostMedia files={JSON.parse(post.files)}/> */}
              <div className='ml-1'>
                <div className='flex w-full px-16'>
                  <div className={`grow`}/>
                  <div className={`min-w-[111px] justify-center flex group items-center w-fit relative`}>
                    <svg
                      viewBox="0 0 40 40"
                      fill="none"
                      className="h-[40px] w-[40px] fill-gray-500 dark:fill-gray-300 group-hover:fill-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16.7698 26.04L16.7796 26.0214C16.8013 25.98 16.8245 25.9351 16.8491 25.8873C17.03 25.5371 17.2911 25.0314 17.6274 24.6275C18.0608 24.1068 18.7281 23.6137 19.6907 23.6137C22.7525 23.6137 24.8033 23.173 26.0492 22.4503C27.1805 21.794 27.7035 20.8819 27.7035 19.5258C27.7035 16.3261 24.3811 13.2965 19.6907 13.2965C15.2771 13.2965 12.2965 16.1275 12.2965 19.5258C12.2965 20.3629 12.6319 22.2529 13.4911 23.5026L13.4978 23.5125L13.4978 23.5125C14.3586 24.7897 15.3301 25.7902 16.4883 26.5864C16.5026 26.5622 16.5179 26.5356 16.5341 26.5064C16.6042 26.3801 16.6748 26.2365 16.7606 26.059L16.7698 26.04ZM17.9278 26.6233C17.9537 26.574 17.9795 26.5244 18.0053 26.4748C18.4108 25.6944 18.8183 24.9101 19.6907 24.9101C25.9691 24.9101 29 23.1358 29 19.5258C29 15.3652 24.8247 12 19.6907 12C14.7423 12 11 15.2428 11 19.5258C11 20.5354 11.3711 22.7075 12.4227 24.2371C13.4124 25.7055 14.5567 26.8681 15.9485 27.7858C16.1649 27.9388 16.3814 28 16.5979 28C17.2474 28 17.5876 27.327 17.9278 26.6233Z"
                      ></path>
                    </svg>
                    {!zenMode && <p className="text-gray-500 dark:text-gray-300 group-hover:text-green-500">
                        {post.answers !== undefined && post.answers.length}
                      </p>}
                  </div>
                  <BoostButton tx_id={post.tx_id} difficulty={post.difficulty !== undefined ? post.difficulty : difficulty || 0} zenMode={zenMode}/>
                  {/* <div className='col-span-3 flex group items-center w-fit relative'>
                    <svg
                      viewBox="0 0 40 40"
                      fill="none"
                      className="h-[40px] w-[40px] fill-gray-500 dark:fill-gray-300 hover:fill-gray-700 hover:dark:fill-gray-500"
                    >
                      <path d="M16.4198 12.7306V13.4612H26.1734C26.3926 13.4612 26.5387 13.6073 26.5387 13.8265V23.5802C26.5387 23.7994 26.3926 23.9455 26.1734 23.9455H16.4198C16.2006 23.9455 16.0545 23.7994 16.0545 23.5802V13.8265C16.0545 13.6073 16.2006 13.4612 16.4198 13.4612V12.7306V12C15.3969 12 14.5933 12.8037 14.5933 13.8265V23.5802C14.5933 24.603 15.3969 25.4067 16.4198 25.4067H26.1734C27.1963 25.4067 28 24.603 28 23.5802V13.8265C28 12.8037 27.1963 12 26.1734 12H16.4198V12.7306Z"></path>
                      <path d="M23.6898 26.5758H13.7169C13.5708 26.5758 13.4612 26.4662 13.4612 26.32V16.3107C13.4612 15.9089 13.1324 15.5801 12.7306 15.5801C12.3288 15.5801 12 15.9089 12 16.3107V26.2835C12 27.2333 12.7671 28.0004 13.7169 28.0004H23.6898C24.0916 28.0004 24.4204 27.6717 24.4204 27.2698C24.4204 26.9045 24.0916 26.5758 23.6898 26.5758Z"></path>
                    </svg>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DetailPostCard