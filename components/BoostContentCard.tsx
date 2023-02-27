import moment from 'moment';
import { BoostButton } from 'myboostpow-lib';
import React, { useEffect, useState } from 'react';

import { toast } from 'react-hot-toast';

import UserIcon from './UserIcon';
import OnchainEvent from './OnChainEvent';

import Twetch from './Twetch';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import RelayClub from './RelayClub';
import PostMedia from './PostMedia';
import Linkify from 'linkify-react';
import { Tooltip } from 'react-tooltip'

import { useBitcoin } from '../context/BitcoinContext';
const Markdown = require('react-remarkable')

const RemarkableOptions = {
    breaks: true,
    html: true,
    typographer: true,
    /* highlight: function (str: any, lang: any) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (err) {}
      }
  
      try {
        return hljs.highlightAuto(str).value;
      } catch (err) {}
  
      return ''; // use external default escaping
    } */
}

export const BFILE_REGEX = /b:\/\/([a-fA-F0-9]{64})/g;

export interface Ranking {
    content_txid: string;
    content_text?: string;
    content_type?:string;
    count?: number;
    difficulty?: number;
    createdAt?: Date;
}

const BoostContentCard = ({ content_txid, content_type, content_text, count, difficulty, createdAt }: Ranking) => {
    const author = null 
    const [isTwetch, setIsTwetch] = useState(false)
    const [isClub, setIsClub] = useState(false)
    const router = useRouter()
    const theme = useTheme()
    const { wallet } = useBitcoin()

    const handleBoostLoading = () => {
        toast('Publishing Your Boost Job to the Network', {
            icon: '⛏️',
            style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            },
          });
      };
    
      const handleBoostSuccess = () => {
        toast('Success!', {
            icon: '✅',
            style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            },
          });
      };
    
      const handleBoostError = () => {
        toast('Error!', {
            icon: '🐛',
            style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            },
        });
      };

    const PostContent = () => {
        return (
            <>
            {content_type?.match('image') && (
                content_text ? <img src={`data:image/jpeg;base64,${content_text}`} className="w-full h-full rounded-lg"/> : <PostMedia files={[content_txid]}/>
            )}
            {content_type?.match('text/plain') && (
                <div className='mt-1 text-gray-900 dark:text-white text-base leading-6 whitespace-pre-line break-words'><Linkify options={{target: '_blank' , className: 'linkify-hover'}}>{content_text}</Linkify></div>
            )}
            {content_type?.match('markdown') && (
                <article className='prose dark:prose-invert prose-a:text-blue-600 break-words'>
                    <Markdown options={RemarkableOptions} source={content_text!.replace(BFILE_REGEX, `https://dogefiles.twetch.app/$1`)}/>
                </article>
            )}
            <OnchainEvent txid={content_txid}/>
            </>
        )
        
    }

    const navigate = (e: any) => {
        e.stopPropagation()
        router.push(`/${content_txid}`)
    }


  return (
    <div onClick={navigate} className='grid grid-cols-12 bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 mt-0.5 first:md:rounded-t-lg last:md:rounded-b-lg'>
        <Twetch setIsTwetch={setIsTwetch} txid={content_txid} difficulty={difficulty || 0}/>
        <RelayClub setIsClub={setIsClub} txid={content_txid} difficulty={difficulty || 0}/>
        {!(isTwetch || isClub) && <div className='col-span-12'>
            <div className="mb-0.5 px-4 pt-4 pb-1 grid items-start grid-cols-12 max-w-screen cursor-pointer">
                {author && (
                    <div className='col-span-1'>
                        <a>
                            <UserIcon src={"https://a.relayx.com/u/anon@relayx.com"} size={46}/>
                        </a>
                    </div>
                )}
                <div className={`col-span-${author? 11 : 12} ml-6`}>
                       <div className='flex'>
                            {author && (
                            <div 
                                onClick={(e:any) => e.stopPropagation()}
                                className="text-base leading-4 font-bold text-gray-900 dark:text-white cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis hover:underline"
                            >
                                1anon
                            </div>
                            )}
                            <div className='grow'/>
                            
                            <a  onClick={(e:any)=>e.stopPropagation()}
                                target="_blank"
                                rel="noreferrer"
                                href={`https://whatsonchain.com/tx/${content_txid}`}
                                className="text-xs leading-5 whitespace-nowrap text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:dark:text-gray-500"
                                id="txid"
                            >
                                {/* {moment(createdAt).fromNow()} */}
                                txid
                            </a>
                            {/*tooltip*/}
                            <Tooltip
                            anchorSelect="#txid" 
                            place="right" 
                            className="dark:bg-gray-100 text-white dark:text-black italic"
                            clickable
                                
                            >
                                <a 
                                href="https://learnmeabitcoin.com/technical/txid"
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e:any)=>e.stopPropagation()}
                                >
                                    What is a txid?
                                </a>
                                {/* <span>{content_txid}</span> */}
                            </Tooltip>
                        </div>
                    <PostContent/>
                    <div className='flex w-full px-16'>
                        <div className='grow'/>
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
                            <p className="text-gray-500 dark:text-gray-300 group-hover:text-green-500">
                                {/* {0} */}
                            </p>
                        </div>
                        <BoostButton
                            wallet={wallet}
                            content={content_txid}
                            difficulty={difficulty || 0}
                            //@ts-ignore
                            theme={theme.theme}
                            showDifficulty
                            onSending={handleBoostLoading}
                            onError={handleBoostError}
                            onSuccess={handleBoostSuccess}
                        />
                    </div>
                </div> 
            </div>
        </div>}
    </div>
  )
}

export default BoostContentCard