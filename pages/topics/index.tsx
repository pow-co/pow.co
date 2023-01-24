import React, { useState, useEffect} from "react"
import axios from "axios"
import ThreeColumnLayout from "../../components/ThreeColumnLayout"
import Loader from "../../components/Loader"
import Link from "next/link"
import { useTuning } from "../../context/TuningContext"
import { useAPI } from "../../hooks/useAPI"
import BoostContentCard from "../../components/BoostContentCard";

export function cleanString(input: string) {
    var output = "";
    for (var i=0; i<input.length; i++) {
        if (input.charCodeAt(i) <= 127) {
            output += input.charAt(i);
        }
    }
    return output;
}

export interface Ranking {
    tag: string;
    difficulty: number;
    count: number;
  }


export default function TopicList() {
  const { startTimestamp } = useTuning()
  const [loading, setLoading] = useState<boolean>(false)
  const [tags, setTags] = useState<Ranking[]>([])

  useEffect(() => {
        
    setLoading(true)
    axios.get(`https://pow.co/api/v1/boost/rankings/tags?start_date=${startTimestamp}`)
        .then(({data}: {data: any}) => {

            const tags = data.rankings.map((ranking: Ranking) => {
    
                var tag = ranking.tag
    
                try {
    
                    tag = Buffer.from(ranking.tag, 'hex').toString()
    
                    tag = cleanString(tag)
    
                } catch(error) {
    
                    tag = ''
    
                }
    
                return Object.assign(ranking, {
                    tag
                })
            })
            .filter((tag: any) => !/\s/.test(tag.tag))
            .filter((tag: any) => !/[&\/\\#,()$~%'":?<>{}]/.test(tag.tag))
            .filter((tag: any) => tag.tag != '\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
            .filter((tag: any) => tag.tag != '')
    
        

            setTags(tags)

            setLoading(false)

        })


  }, [startTimestamp])

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
        <div className="mt-5 lg:mt-10 mb-[200px]">
            <div className='flex flex-col p-5 bg-primary-100 dark:bg-primary-600/20 rounded-lg'>
                <table className='table-auto text-gray-900 dark:text-white'>
                    <thead className='text-lg font-semibold'>
                    <tr>
                        <th>Tag</th>
                        <th>Difficulty</th>
                        <th>Count</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tags.map((el:Ranking) => (
                        <tr key={el.tag} className=' hover:bg-primary-200 hover:dark:bg-primary-500/20'>
                        <Link href={`/topics/${el.tag}`}>
                            <th>{el.tag}</th>
                        </Link>
                        <th>{el.difficulty.toFixed(3)}</th>
                        <th>{el.count}</th>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </ThreeColumnLayout>
    </>
  )
}
