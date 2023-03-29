import { useEffect, useState } from "react"
import ThreeColumnLayout from "../components/ThreeColumnLayout"
import Loader from "../components/Loader"
import { useTuning } from "../context/TuningContext"
import { useAPI } from "../hooks/useAPI"
import BoostContentCard from "../components/BoostContentCard";
import { BoostButton } from "boostpow-button";
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
import { queryBMAP } from "../components/BoostContentCard"
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

export const queryComments = (replyTx: string) => {
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


export default function DetailPage() {
  const { startTimestamp } = useTuning()
  const [loading, setLoading] = useState(false)
  const [twetch, setTwetch] = useState<any>(null)
  const [replies, setReplies] = useState<any>(null)
  const [inReplyTx, setInReplyTx] = useState("")
  const router = useRouter()
  const theme = useTheme()
  const query = router.query
  const author = null
  const { wallet } = useBitcoin()

  useEffect(() => {
    setLoading(true)
    query.txid && getData().then((res) => {
      console.log(res)
      setTwetch(res.twetchResult)
      setReplies(res.comments)
      setInReplyTx(res.inReplyTx)
      setLoading(false)
    })
  },[query])

  const getData = async () => {
    const [twetchResult, bmapResponse, commentsResponse] = await Promise.all([
      twetchDetailQuery(query.txid?.toString()).catch((err)=>console.log(err)),
      axios.get(`https://b.map.sv/q/${query.txid && btoa(JSON.stringify(queryBMAP(query.txid?.toString())))}`)
        .catch((error) => ({ data: { c: [] } })),
      axios.get(`https://b.map.sv/q/${query.txid && btoa(JSON.stringify(queryComments(query.txid?.toString())))}`)
        .catch((error) => ({ data: { c: [] } })),
    ]);

  
    const bmap = bmapResponse.data.c[0] || {}
    const comments = commentsResponse.data.c || [];

    const inReplyTx = bmap?.MAP?.tx
  
    return { twetchResult, bmap, comments, inReplyTx } 

  }

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

  if (loading){
    return (
      <>
      <ThreeColumnLayout>
        <div className="mt-5 lg:mt-10">
          <Loader/>
        </div>
      </ThreeColumnLayout>
      </>
    )
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
        {inReplyTx && <BoostContentCard content_txid={inReplyTx} />}
        {query.txid && <BoostContentCard content_txid={query.txid.toString()}/>}
        {query.txid &&
          <div className="mt-1 bg-primary-100 dark:bg-primary-600/20 px-4 pt-2 pb-1 sm:last:rounded-b-lg">
            <CommentComposer replyTx={query.txid?.toString()}/>
          </div>}
        {twetch?.postsByReplyPostId.edges.map((t:any)=>{

          return <TwetchCard key={t.node.transaction} {...t.node}/>
        })}
        {replies?.map((reply:BMAPData)=>{
          return <BoostContentCard key={reply.tx.h} content_txid={reply.tx.h} />
        })}
      </div>
    </div>
    </ThreeColumnLayout>
    </>
  )
}
