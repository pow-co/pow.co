import moment from 'moment';
import { BoostButton } from 'boostpow-button';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
import axios from 'axios';
import {BASE, useAPI} from '../hooks/useAPI';
import { useTuning } from '../context/TuningContext';
import { queryComments } from '../pages/[txid]';
import Gist from 'super-react-gist'
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

export const queryBMAP = (txid: string) => {
    return {
      "v": 3,
      "q": {
        "find": {
          "tx.h": txid
        },
        "project": {
          "out": 0,
          "in": 0
        }
      }
    }
  }

const BoostContentCard = ({ content_txid, content_type, content_text, count, difficulty, createdAt }: Ranking) => {
    const [isTwetch, setIsTwetch] = useState(false)
    const [isClub, setIsClub] = useState(false)
    const router = useRouter()
    const theme = useTheme()
    const { wallet } = useBitcoin()
    const { startTimestamp, filter, setFilter } = useTuning()
    const [commentCount, setCommentCount] = useState(0)
    const [inReplyTo, setInReplyTo] = useState("")
    const [paymail, setPaymail] = useState<string>("")
    const [avatar, setAvatar] = useState<string>("")

    const [loading, setLoading] = useState<boolean>(true)

    const [content, setContent] = useState<any>(null)
    const [tags, setTags] = useState<any>([])
    const [timestamp, setTimestamp] = useState(0)

    useEffect(() => {
        getData().then((res) => {
            setContent(res.content)
            setTags(res.tags)
            if (res.bmapContent?.MAP[0].type === "reply" && res.bmapContent?.MAP[0].context === "tx"){
                setInReplyTo(res.bmapContent.MAP[0].tx)
            }
            if (res.content.createdAt){
                setTimestamp(moment(res.content.createdAt).unix())
            } else {
                setTimestamp(res.bmapContent?.timestamp)
            }
            setPaymail(res.bmapContent?.MAP[0].paymail)
            switch (true) {
                case res.bmapContent?.MAP[0]?.paymail?.includes("relayx"):
                  setAvatar(`https://a.relayx.com/u/${res.bmapContent.MAP[0].paymail}`);
                  break;
                case res.bmapContent?.MAP[0]?.paymail?.includes("twetch"):
                    setAvatar(`https://auth.twetch.app/api/v2/users/${res.bmapContent.MAP[0].paymail.split("@")[0]}/icon`)
                    break
                case res.bmapContent?.MAP?.paymail?.includes("handcash"):
                    setAvatar(`https://cloud.handcash.io/v2/users/profilePicture/${res.bmapContent.MAP[0].paymail.split("@")[0]}`)
                    break
                default:
                    setAvatar("");
            }
            setCommentCount(res.bmapComments.length)
            setLoading(false)
        })
        /* axios.get(`${BASE}/content/${content_txid}`).then(({data}) => {
            setContent(data.content)
            setLoading(false)
        })
        .catch((err) => {
            console.error('api.content.fetch.error', err)
        }) */
    }, [])

    const getData = async () => {
        //const [content, bmapContent, bmapComments, tagsResult] = await Promise.all([
        const [contentResult, bmapContentResult, bmapCommentsResult] = await Promise.all([
            axios.get(`${BASE}/content/${content_txid}`)
                .catch((err) => {
                    console.error('api.content.fetch.error', err)
                    return { data: { content: {}}}
                }),
            axios.get(`https://b.map.sv/q/${content_txid && btoa(JSON.stringify(queryBMAP(content_txid)))}`).catch((err) => {
                console.error('bmap.post.fetch.error', err)
                return { data: { c: [] } }
            }),
            axios.get(`https://b.map.sv/q/${content_txid && btoa(JSON.stringify(queryComments(content_txid)))}`).catch((err) => {
                console.error('bmap.post.fetch.error', err)
                return { data: { c: [] } }
            }),
        ])


        const content = contentResult.data.content;
        const tags = contentResult.data.tags;
        const bmapContent = bmapContentResult.data.c[0] || null;
        const bmapComments = bmapCommentsResult.data.c || [];

        return { content, tags, bmapContent, bmapComments}


    }

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

      //if (content) {

        content_text = content?.content_text || content_text

        content_type = content?.content_type || content_type
      //}

      if (loading || !content) {
        return (
            <div className='grid grid-cols-12 bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 mt-0.5 first:md:rounded-t-lg last:md:rounded-b-lg'>
            <div className="mb-0.5 px-4 pt-4 pb-1 grid items-start grid-cols-12 max-w-screen cursor-pointer">
            </div>
        </div>
        )
      }
    const PostContent = () => {
        if (content?.content_text?.startsWith('https://gist.github.com/')) {
            return <>
              <small className=''><a href={content?.content_text} target="_blank" className='blankLink' rel="noreferrer">{content?.content_text}</a></small>
                <div className='text-ellipsis '>
                    <Gist url={content?.content_text} />
                </div>
                </>
        }

        return (
            <>
            {content.content_type?.match('image') && (
                content.content_text ? <img src={`data:image/jpeg;base64,${content.content_text}`} className="w-full h-full rounded-lg"/> : <PostMedia files={[content.txid]}/>
            )}
            {content.content_type?.match('text/plain') && (
                <div className='mt-1 text-gray-900 dark:text-white text-base leading-6 whitespace-pre-line break-words'><Linkify options={{target: '_blank' , className: 'linkify-hover text-blue-500 hover:underline'}}>{content_text}</Linkify></div>
            )}
            {content.content_type?.match('markdown') && (
                <article className='prose dark:prose-invert prose-a:text-blue-600 break-words'>
                    <Markdown options={RemarkableOptions} source={content.content_text!.replace(BFILE_REGEX, `https://dogefiles.twetch.app/$1`)}/>
                </article>
            )}
            <OnchainEvent txid={content.txid}/>
            </>
        )

    }

    const navigate = (e: any) => {
        e.stopPropagation()
        router.push(`/${content_txid}`)
    }



    if (!content) {
        return (
            <div onClick={navigate} className='grid grid-cols-12 bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 mt-0.5 first:md:rounded-t-lg last:md:rounded-b-lg'>
                <div className="mb-0.5 px-4 pt-4 pb-1 grid items-start grid-cols-12 max-w-screen cursor-pointer">
                </div>
            </div>
        )
    }

    //console.log('CONTENT.MAP', content.map)

  return (
    <div onClick={navigate} className='grid grid-cols-12 bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 mt-0.5 first:md:rounded-t-lg last:md:rounded-b-lg'>
        {inReplyTo.length > 0 && router.pathname === "/" && <p className='col-span-12 pt-3 px-4 text-sm italic text-gray-600 text-ellipsis overflow-hidden dark:text-gray-400'>in reply to <span className='text-primary-500 text-xs hover:underline'><Link href={`/${inReplyTo}`}>{inReplyTo}</Link></span></p>}
        <Twetch setIsTwetch={setIsTwetch} txid={content.txid} difficulty={difficulty || 0} tags={tags}/>
        <RelayClub setIsClub={setIsClub} txid={content.txid} difficulty={difficulty || 0} tags={tags}/>
        {!(isTwetch || isClub) && <div className='col-span-12'>
            <div className="mb-0.5 pt-4 px-4 grid items-start grid-cols-12 max-w-screen cursor-pointer">
                {paymail && (
                    <div className='col-span-1'>
                        <Link onClick={(e:any) => e.stopPropagation()} href={`/profile/${paymail}`}>
                            <UserIcon src={avatar} size={46}/>
                        </Link>
                    </div>
                )}
                <div className={`col-span-${paymail? 11 : 12} ml-6`}>
                       <div className='flex'>
                            {paymail && (
                            <Link href={`/profile/${paymail}`}
                                onClick={(e:any) => e.stopPropagation()}
                                className="text-base leading-4 font-bold text-gray-900 dark:text-white cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis hover:underline"
                            >
                                {paymail}
                            </Link>
                            )}
                            <div className='grow'/>

                            <a  onClick={(e:any)=>e.stopPropagation()}
                                target="_blank"
                                rel="noreferrer"
                                href={`https://whatsonchain.com/tx/${content.txid}`}
                                className="text-xs leading-5 whitespace-nowrap text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:dark:text-gray-500"
                                id={`_${content.txid}`}
                            >
                                {moment(timestamp * 1000).fromNow()}
                            </a>
                            {/*tooltip*/}
                            <Tooltip
                            anchorSelect={`#_${content.txid}`}
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
                                {commentCount}
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
        <div className='flex flex-wrap overflow-hidden w-full px-4 pb-4'>
            {tags?.map((tag:any, index: number)=>{
                if(tag.utf8.length > 0){
                    return (
                        <Link key={index} onClick={(e:any)=>e.stopPropagation()} href={`/topics/${tag.utf8}`}>
                            <div  className="flex items-center mt-2 mr-2 p-2 rounded-full bg-primary-500 text-white text-sm font-bold">{tag.utf8} <span className='ml-2'>⛏️ {Math.round(tag.difficulty)}</span></div>
                        </Link>
                    )
                }
            })}
        </div>
        </div>}
    </div>
  )
}

export default BoostContentCard