import moment from 'moment';
import { BoostButton } from 'myboostpow-lib';
import React from 'react'
import UserIcon from './UserIcon';
import { Id, toast } from 'react-toastify';
import OnchainEvent from './OnChainEvent';
import Twetch from './Twetch';
import { useRouter } from 'next/router';
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

export interface Ranking {
    content_txid: string;
    content_text?: string;
    content_type?:string;
    count: number;
    difficulty: number;
    createdAt?: Date;
}

const BoostContentCard = ({ content_txid, content_type, content_text, count, difficulty, createdAt }: Ranking) => {
    const author = null 
    const router = useRouter()


    let toastId:Id;

    const handleBoostLoading = () => {
        toastId = toast.loading("Transaction pending...", {
          autoClose: 5000,
        });
      };
    
      const handleBoostSuccess = () => {
        toast.update(toastId, {
          render: "Transaction Successful",
          type: "success",
          isLoading: false,
        });
      };
    
      const handleBoostError = () => {
        toast.update(toastId, {
          render: "Transaction Failed",
          type: "error",
          isLoading: false,
        });
      };

    const PostContent = () => {
        return (
            <>
            {content_type?.match('image') && (
                <div className=''>
                    <img alt='bitcoin file server image' src={`https://bitcoinfileserver.com/${content_txid}`}/>
                </div>
            )}
            {content_type?.match('text/plain') && (
                <div className='mt-1 text-gray-900 dark:text-white text-base leading-6 whitespace-pre-line break-words'>{content_text}</div>
            )}
            {content_type?.match('markdown') && (
                <article className='prose dark:prose-invert prose-a:text-blue-600'>
                    <Markdown options={RemarkableOptions} source={content_text!}/>
                </article>
            )}
            <OnchainEvent txid={content_txid}/>
            <Twetch txid={content_txid}/>
            </>
        )
        
    }

    const navigate = () => {
        router.push(`/${content_txid}`)
    }


  return (
    <div onClick={navigate} className='grid grid-cols-12 bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 mt-0.5 first:md:rounded-t-lg last:md:rounded-b-lg'>
        <div className='col-span-12'>
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
                            <a 
                                target="_blank"
                                rel="noreferrer"
                                href={`https://whatsonchain.com/tx/${content_txid}`}
                                className="text-xs leading-5 whitespace-nowrap text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:dark:text-gray-500"
                            >
                                {/* {moment(createdAt).fromNow()} */}
                                txid
                            </a>

                        </div>
                    <PostContent/>
                    <div className='ml-1'>
                        <div className='flex w-full px-16'>
                            <div className='grow'/>
                            <BoostButton
                                content={content_txid}
                                difficulty={difficulty || 0}
                                showDifficulty
                                onSending={handleBoostLoading}
                                onError={handleBoostError}
                                onSuccess={handleBoostSuccess}
                            />
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    </div>
  )
}

export default BoostContentCard