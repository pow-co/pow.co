
import { request } from 'graphql-request'
import moment from 'moment';
import { toast } from 'react-hot-toast';
import { BoostButton } from 'myboostpow-lib';
const graphqlAPI = "https://graphql.relayx.com";

export const relayDetailQuery = async (txid: string | undefined) => {
  
  const query = `
  query ($txid: String!) {
    post(txid: $txid) {
      txid
      time
      text
      user {
        paymail
        name
        __typename
      }
      jig {
        origin
        location
        name
        image
        audio
        no
        total
        cls {
          name
          origin
          owner
          user {
            paymail
            __typename
          }
          royalties {
            royalty
            __typename
          }
          __typename
        }
        order {
          status
          satoshis
          seller
          __typename
        }
        __typename
      }
      replies {
        total
        __typename
      }
      replies {
        replies {
          txid
          text
          time
          user {
            name
            paymail
            __typename
          }
          jig {
            origin
            location
            name
            image
            audio
            no
            total
            cls {
              name
              origin
              owner
              user {
                paymail
                __typename
              }
              royalties {
                royalty
                __typename
              }
              __typename
            }
            order {
              status
              satoshis
              seller
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }
  `;

  //const result = await graphqlClient.request(query, { txid });
  const result = await request(graphqlAPI, query, { txid });


  return result.post
};


import { Dispatch, SetStateAction, useEffect, useState } from "react"
import PostDescription from './PostDescription';
import PostMedia from './PostMedia';
import UserIcon from './UserIcon';
import { useTheme } from 'next-themes';

export default function RelayClub({ txid, setIsClub, difficulty }: { txid: string, setIsClub: Dispatch<SetStateAction<boolean>>, difficulty: number }) {
    const [loading, setLoading] = useState(false)

    const [post, setPost] = useState<any>()

    useEffect(() => {
        (async () => {
            setLoading(true)
          
          if (txid) {

            const result = await relayDetailQuery(txid)
            setPost(result)
            setLoading(false)
          }



        })()

    }, [txid])

    if (loading){
        return (
            <div className=''>
                <div role="status" className="max-w-sm animate-pulse">
                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5"></div>
                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }
    if(post){
        setIsClub(true)
        return (
            <RelayClubCard {...post} difficulty={difficulty} />
    ) 
    } else {
        return <></>
    }
}

export const RelayClubCard = (props: any) => {
    const theme = useTheme()
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
        <div className="col-span-12 px-4 pt-4 pb-1  bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 sm:rounded-lg">
          <div className='mb-0.5  grid items-start grid-cols-12 max-w-screen '>
            <div className="col-span-1">
              {/* <Link  href={`/u/${post.userId}`}> */}
                <a onClick={(e:any)=> e.stopPropagation()}>
                  <UserIcon src={`https://a.relayx.com/u/${props.user.paymail}`} size={46}/>
                </a>
              {/* </Link> */}
            </div>
            <div className="col-span-11 ml-6">
              <div className="flex">
              {/* <Link  href={`/u/${post.userId}`}> */}
                <div onClick={(e)=>e.stopPropagation()} className='text-base leading-4 font-bold text-gray-900 dark:text-white cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis	hover:underline'>
                {props.user.name || `1${props.user.paymail.split('@')[0]}`}
                </div>
              {/* </Link> */}
              <div className="grow"/>
              <a target="_blank" rel="noreferrer" href={`https://whatsonchain.com/tx/${props.txid}`} className='text-xs leading-5 whitespace-nowrap text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:dark:text-gray-500'>
                {moment(props.time *1000).fromNow()}
              </a>
              <a href={`https://club.relayx.com/p/${props.txid}`} target="_blank" rel="noreferrer" onClick={(e)=>e.stopPropagation()}>
                <div className='flex items-center ml-4 h-5 w-5 text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:dark:text-gray-500'>
                  <img src="https://club.relayx.com/favicon.ico"/>
                </div>
                </a>
              </div>
              <PostDescription bContent={props.text}/>
              <div className="bg-primary-300 dark:bg-primary-700 rounded-lg mt-4">
                <img alt="berry" src={`https://berry.relayx.com/${props.jig.image}`} className="rounded-t-lg"/>
                <div className="flex items-center p-2">
                  <div className="mr-2">
                    <UserIcon size={36} src={`https://a.relayx.com/u/${props.jig.cls.user.paymail}`}/>
                  </div>
                  <div className="grow">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-bold">{props.jig.cls.user.paymail}</h2>
                      <p className="">{props.jig.name} #{props.jig.no}/{props.jig.total}</p>
                    </div>
                  </div>
                  <div className="mr-5">
                    {props.jig.order.status === "sold" ? (
                      <div className="px-5 py-2 bg-red-600 rounded-2xl text-white">Sold</div>
                    ):(
                      <div className="px-5 py-2 bg-blue-600 rounded-2xl text-white">Buy</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex w-full px-16'>
            <div className="grow"/>
            <BoostButton
                content={props.txid}
                difficulty={props.difficulty}
                //@ts-ignore
                theme={theme.theme}
                showDifficulty
                onSending={handleBoostLoading}
                onError={handleBoostError}
                onSuccess={handleBoostSuccess}
            />
          </div>
        </div>
    )
}