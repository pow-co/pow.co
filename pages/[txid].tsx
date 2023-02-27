import ThreeColumnLayout from "../components/ThreeColumnLayout"
import Loader from "../components/Loader"
import { useTuning } from "../context/TuningContext"
import { useAPI } from "../hooks/useAPI"
import BoostContentCard from "../components/BoostContentCard";
import { BoostButton } from "myboostpow-lib";
import { Ranking } from "../components/BoostContentCard";
import { toast } from "react-hot-toast"
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { TwetchCard, twetchDetailQuery } from "../components/Twetch";
import { RelayClubCard, relayDetailQuery } from "../components/RelayClub";
import axios from "axios";
import UserIcon from "../components/UserIcon";
import moment from "moment";
import PostDescription from "../components/PostDescription";
import { useTheme } from "next-themes";
const Markdown = require('react-remarkable')
import OnchainEvent from "../components/OnChainEvent";
import PostMedia from "../components/PostMedia";
import Linkify from "linkify-react";
import { BFILE_REGEX } from "../components/BoostContentCard";
import CommentComposer from "../components/CommentComposer";
import ReplyCard, { BMAPData } from "../components/ReplyCard";
import { useBitcoin } from "../context/BitcoinContext";

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

const queryComments = (replyTx: string) => {
  return {
    "v": 3,
    "q": {
      "find": {
        "MAP.type": "reply",
        "MAP.context": "tx",
        "MAP.tx": replyTx
      },
      "project": {
        "out": 0,
        "in": 0
      }
    }
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { txid } = context.query
  const twetchResult = await twetchDetailQuery(txid?.toString())
  const relayResult = await relayDetailQuery(txid?.toString())

  let boostResult
  let comments: any =[]
  try {
    const queryB64 = txid && btoa(JSON.stringify(queryComments(txid?.toString())))
    const commentsResponse = await axios.get(`https://b.map.sv/q/${queryB64}`)
    comments = commentsResponse.data.c
  } catch (error) {
    console.log(error)
  }

  try {
    const boostResponse = await axios.get(`https://pow.co/api/v1/content/${txid}`)
    boostResult=boostResponse.data
  } catch (error) {
    boostResult=null
  }

  return {
    props: {
      twetch: twetchResult,
      relay: relayResult,
      boost: boostResult,
      replies: comments
    }
  }
}


export default function DetailPage({ twetch, relay, boost, replies }: any) {
  const { startTimestamp } = useTuning()
  const router = useRouter()
  const theme = useTheme()
  const query = router.query
  const author = null
  const { wallet } = useBitcoin()
  let content;
  /* from youtube Link {
    "id": 1783,
    "txid": "7daa300c98f5c7adda09cc48de097009059e34f78029e28c90d558b197d538e3",
    "content_type": "application/json",
    "content_json": {
        "url": "https://www.youtube.com/watch?v=AaBc1MCX-Xg",
        "_app": "pow.co",
        "_type": "url",
        "_nonce": "a6a6e28f-9a1a-4b79-a964-28025e8b50b7"
    },
    "content_text": null,
    "content_bytes": null,
    "map": {
        "app": "pow.co",
        "type": "url"
    },
    "createdAt": "2023-02-12T23:05:14.544Z",
    "updatedAt": "2023-02-12T23:05:14.544Z"
  } */


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

  if(!twetch && !relay && !boost) {
    return (<ThreeColumnLayout>
      <div className="mt-5 lg:mt-10 h-screen">
        Data unavailable
      </div>
    </ThreeColumnLayout>)
  }


  return (
    <>
    <ThreeColumnLayout>
    <div className="col-span-12 lg:col-span-6 min-h-screen">
        <svg
          onClick={() => router.back()}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="relative top-[69px] -left-[42px] w-6 h-6 stroke-gray-700 dark:stroke-gray-300 cursor-pointer hover:opacity-70"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      <div className="mt-5 lg:mt-10 pb-[200px]">
        {relay && <RelayClubCard {...relay} difficulty={boost?.content.difficulty || 0}/>}
        {twetch && <TwetchCard {...twetch} difficulty={boost?.content.difficulty || 0} />}
        {!twetch && !relay && boost && (
          <div className='col-span-12 px-4 pt-4 pb-1  bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 sm:rounded-t-lg'>
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
                      href={`https://whatsonchain.com/tx/${boost.content.txid}`}
                      className="text-xs leading-5 whitespace-nowrap text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:dark:text-gray-500"
                  >
                      {/* {moment(createdAt).fromNow()} */}
                      txid
                  </a>
                </div>
                <>
                  {boost.content.content_type?.match('image') && (
                    boost.content_text ? <img src={`data:image/jpeg;base64,${boost.content_text}`} className="w-full h-full rounded-lg"/> : <PostMedia files={[boost.content.txid]}/>
                  )}
                  {boost.content.content_type?.match('text/plain') && (
                      <div className='mt-1 text-gray-900 dark:text-white text-base leading-6 whitespace-pre-line break-words'><Linkify options={{target: '_blank' , className: 'linkify-hover'}}>{boost.content.content_text}</Linkify></div>
                  )}
                  {boost.content.content_type?.match('markdown') && (
                      <article className='prose dark:prose-invert prose-a:text-blue-600 break-words'>
                          <Markdown options={RemarkableOptions} source={boost.content.content_text!.replace(BFILE_REGEX, `https://dogefiles.twetch.app/$1`)}/>
                      </article>
                  )}
                  <OnchainEvent txid={boost.content.txid}/>
                </>
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
                        {0}
                      </p>
                    </div>
                    <BoostButton
                        wallet={wallet}
                        content={boost.content.txid}
                        difficulty={boost.content.difficulty || 0}
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
          </div>
        )}
        {query.txid &&
          <div className="mt-1 bg-primary-100 dark:bg-primary-600/20 px-4 pt-2 pb-1 sm:last:rounded-b-lg">
            <CommentComposer replyTx={query.txid?.toString()}/>
          </div>}
        {twetch?.postsByReplyPostId.edges.map((t:any)=>{

          return <TwetchCard key={t.node.transaction} {...t.node}/>
        })}
        {replies.map((reply:BMAPData)=>{
          return <ReplyCard key={reply.tx.h} {...reply} />
        })}
      </div>
    </div>
    </ThreeColumnLayout>
    </>
  )
}
