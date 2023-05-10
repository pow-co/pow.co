import { useEffect, useState } from "react"
import ThreeColumnLayout from "../components/ThreeColumnLayout"
import Loader from "../components/Loader"
import { useTuning } from "../context/TuningContext"
import BoostContentCard from "../components/BoostContentCard";
import { toast } from "react-hot-toast"
import { useRouter } from "next/router";
import { TwetchCard, twetchDetailQuery } from "../components/Twetch";
import axios from "axios";
import { useTheme } from "next-themes";
import CommentComposer from "../components/CommentComposer";
import { useBitcoin } from "../context/BitcoinContext";


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
      setTwetch(res.twetchResult)
      setReplies(res.replies)
      setInReplyTx(res.inReplyTx)
      setLoading(false)
    })
  },[query])

  const getData = async () => {
    const [twetchResult, contentResponse, repliesResponse] = await Promise.all([
      twetchDetailQuery(query.txid?.toString()).catch((err)=>console.log(err)),
      axios.get(`https://pow.co/api/v1/content/${query.txid}`),
      axios.get(`https://pow.co/api/v1/content/${query.txid}/replies`)
    ]);

    //setReplies(repliesResponse.data.replies)
    const replies = repliesResponse.data.replies
    const inReplyTx =  contentResponse.data.content.context_txid || ''

    return { twetchResult, inReplyTx, replies } 

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
        {replies?.map((reply:any)=>{
          return <BoostContentCard key={reply.txid} content_txid={reply.txid} />
        })}
      </div>
    </div>
    </ThreeColumnLayout>
    </>
  )
}
