import Link from "next/link"
import ThreeColumnLayout from "../../components/ThreeColumnLayout"
import Loader from "../../components/Loader"
import { useTuning } from "../../context/TuningContext"
import { useAPI } from "../../hooks/useAPI"
import { Ranking } from "../../components/BoostContentCard";
import { useRouter } from "next/router";
import BoostContentCardV2 from "../../components/BoostContentCardV2";
import ComposerV2 from "../../components/ComposerV2";
import { useBitcoin } from "../../context/BitcoinContext";


export default function TopicPage() {
  const { startTimestamp } = useTuning()
  const { authenticated } = useBitcoin()
  const router = useRouter()
  const query = router.query
  let tag='';
  if (query.tag){
    tag = query.tag.toString()
  } else {
    tag = ''
  }
  const hexTag = Buffer.from(tag, 'utf-8').toString('hex')
  const { data, error, loading } = useAPI(`/boost/rankings?tag=${hexTag}`, '')

  if (loading){
    return (
      <ThreeColumnLayout>
        <div className="mt-5 lg:mt-10">
          <Loader/>
        </div>
      </ThreeColumnLayout>
    )
  }

  if (error) {
    return (
      <ThreeColumnLayout>
        Error, something happened
      </ThreeColumnLayout>
    )
  }

  
  let { rankings } = data 
  
  return (
    <ThreeColumnLayout>
    <div className="flex flex-col col-span-12 lg:col-span-6 min-h-screen">
      {authenticated && <div className="hidden sm:block mt-5 lg:mt-10">
        <ComposerV2 defaultTag={tag} />
      </div>}
      <div className="mt-5 lg:mt-10 mb-[200px]">
        {rankings?.map((post: Ranking) => {
          return <BoostContentCardV2 key={post.content_txid} defaultTag={tag} {...post}/>
        } )}
      </div>
    </div>
    {authenticated && (
      <Link href={`/compose?t=${tag}`}>
        <div className=" fixed bottom-[73px] right-[14px] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-primary-400 to-primary-500 lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      </Link>
    )}
    </ThreeColumnLayout>
  )
}
