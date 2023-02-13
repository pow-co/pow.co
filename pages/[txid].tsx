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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { txid } = context.query
  const twetchResult = await twetchDetailQuery(txid?.toString())
  const relayResult = await relayDetailQuery(txid?.toString())
  let boostResult

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
      boost: boostResult
    }
  }
}


export default function DetailPage({ twetch, relay, boost }: any) {
  const { startTimestamp } = useTuning()
  const router = useRouter()
  const theme = useTheme()
  const query = router.query
  const author = null
  let content;

  console.log(boost)

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
      <div className="mt-5 lg:mt-10 mb-[200px]">
        {relay && <RelayClubCard {...relay} difficulty={boost?.content.difficulty || 0}/>}
        {twetch && <TwetchCard {...twetch} difficulty={boost?.content.difficulty || 0} />}
        {!twetch && !relay && boost && (
          <div className='col-span-12 px-4 pt-4 pb-1  bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 sm:rounded-lg'>
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
                      <article className='prose dark:prose-invert prose-a:text-blue-600'>
                          <Markdown options={RemarkableOptions} source={boost.content.content_text!}/>
                      </article>
                  )}
                  <OnchainEvent txid={boost.content.txid}/>
                </>
                <div className='flex w-full px-16'>
                    <div className='grow'/>
                    <BoostButton
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
      </div>
    </div>
    </ThreeColumnLayout>
    </>
  )
}
