import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import ThreeColumnLayout from "../components/ThreeColumnLayout";
import Loader from "../components/Loader";
import ComposerV2 from "../components/ComposerV2";
import BoostContentCardV2 from "../components/BoostContentCardV2";

export default function DetailPage() {
  const [loading, setLoading] = useState(false);
  const [replies, setReplies] = useState<any>(null);
  const [inReplyTx, setInReplyTx] = useState("");
  const router = useRouter();
  const { query } = router;

  const getData = useCallback(async () => {
    const [twetchResult, contentResponse, repliesResponse] = await Promise.all([
      axios.get(`https://www.pow.co/api/v1/twetch/${query.txid}`).catch((err) => console.log(err)),
      axios.get(`https://www.pow.co/api/v1/content/${query.txid}`),
      axios.get(`https://www.pow.co/api/v1/content/${query.txid}/replies`),
    ]);

    const { replies } = repliesResponse.data;
    const inReplyTx = contentResponse.data.content.context_txid || '';

    return { twetchResult, inReplyTx, replies }; 
  }, [query.txid]);

  useEffect(() => {
    setLoading(true);
    if (query.txid) {
      getData().then((res) => {
        setReplies(res.replies);
        setInReplyTx(res.inReplyTx);
        setLoading(false);
      });
    }
  }, [query, getData]);

  if (loading) {
    return (
      <ThreeColumnLayout>
        <div className="mt-5 lg:mt-10">
          <Loader />
        </div>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout>
    <div className="col-span-12 min-h-screen lg:col-span-6">
        <svg
          onClick={() => router.back()}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="relative top-[69px] h-6 w-6 translate-x-[-42px] cursor-pointer stroke-gray-700 hover:opacity-70 dark:stroke-gray-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      <div className="mt-5 pb-[200px] lg:mt-10">
        {inReplyTx && <BoostContentCardV2 content_txid={inReplyTx} />}
        {query.txid && <BoostContentCardV2 content_txid={query.txid.toString()} />}
        {query.txid
          && (
<div className="mt-1 bg-primary-100 px-4 pb-1 pt-2 dark:bg-primary-600/20 sm:last:rounded-b-lg">
            <ComposerV2 inReplyTo={query.txid?.toString()} />
</div>
)}
        {replies?.map((reply:any) => <BoostContentCardV2 key={reply.txid} content_txid={reply.txid} />)}
      </div>
    </div>
    </ThreeColumnLayout>
  );
}
