import ThreeColumnLayout from "../../components/ThreeColumnLayout"
import Loader from "../../components/Loader"
import { useTuning } from "../../context/TuningContext"
import { useAPI } from "../../hooks/useAPI"
import BoostContentCard from "../../components/BoostContentCard";
import { Ranking } from "../../components/BoostContentCard";
import { useRouter } from "next/router";
import BoostContentCardV2 from "../../components/BoostContentCardV2";
import Meta from "../../components/Meta";


export default function TopicPage() {
  const { startTimestamp } = useTuning()
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
      <>
      <Meta title={`${tag} Page | The Proof of Work Cooperative`} description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
      <ThreeColumnLayout>
        <div className="mt-5 lg:mt-10">
          <Loader/>
        </div>
      </ThreeColumnLayout>
      </>
    )
  }

  if (error) {
    return (
      <>
      <Meta title={`${tag} Page | The Proof of Work Cooperative`} description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
      <ThreeColumnLayout>
        Error, something happened
      </ThreeColumnLayout>
      </>
    )
  }

  
  let { rankings } = data 
  
  return (
    <>
    <Meta title={`${tag} Page | The Proof of Work Cooperative`} description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
    <ThreeColumnLayout>
    <div className="col-span-12 lg:col-span-6 min-h-screen">
      <div className="mt-5 lg:mt-10 mb-[200px]">
        {rankings?.map((post: Ranking) => {
          return <BoostContentCardV2 key={post.content_txid} {...post}/>
        } )}
      </div>
    </div>
    </ThreeColumnLayout>
    </>
  )
}
