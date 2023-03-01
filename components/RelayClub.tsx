
import { request } from 'graphql-request'
import moment from 'moment';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Link from 'next/link';
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
  const result: any = await request(graphqlAPI, query, { txid });


  return result.post
};


import { Dispatch, SetStateAction, useEffect, useState } from "react"
import PostDescription from './PostDescription';
import PostMedia from './PostMedia';
import UserIcon from './UserIcon';
import { useTheme } from 'next-themes';
import { useRelay } from '../context/RelayContext';
import { useRouter } from 'next/router';
import { useBitcoin } from '../context/BitcoinContext';

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
    const { relayOne } = useRelay()
    const router = useRouter()
    const { wallet } = useBitcoin()

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

      const buyItem = async () => {
        
        const ownerResponse = await relayOne!.alpha.run.getOwner();
        
        try {

            const response = await axios.post(
                "https://staging-backend.relayx.com/api/dex/buy2",
                    {
                    buyer: ownerResponse,
                    cls: props.jig.cls.origin,
                    location: props.jig.location,
                    }
            );
    
            const sendResponse = await relayOne!.send(response.data.data.rawtx);
            console.log(sendResponse)
            return sendResponse
            
        } catch (error) {
          console.log(error)
            throw error
            
        }
            
      };

      const handleBuy = async (e: any) => {
        e.preventDefault()
        if (wallet !== "relayx"){
          toast('Cannot buy run NFTs with Twetch Wallet. Please switch to RelayX', {
            icon: '🛑',
            style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            },
          });
          return
        }
        toast('Publishing Your Buy Order to the Network', {
          icon: '⛏️',
          style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          },
        });
        try {
            const resp = await buyItem()
            toast('Success!', {
              icon: '✅',
              style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
              },
            });
            router.reload()
        } catch (error) {
            console.log(error)
            toast('Error!', {
              icon: '🐛',
              style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
              },
          });
        }

    }

    const navigate = (e:any) => {
      e.preventDefault()
      e.stopPropagation()
      router.push(`/${props.txid}`)
    }
    return (
        <div onClick={navigate} className="cursor-pointer col-span-12 px-4 pt-4 pb-1 mt-1 bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 sm:first:rounded-t-lg sm:last:rounded-b-lg">
          <div className='mb-0.5  grid items-start grid-cols-12 max-w-screen '>
            <div className="col-span-1">
              <Link onClick={(e:any)=> e.stopPropagation()}  href={`/profile/${props.user?.paymail}`}>
                  <UserIcon src={`https://a.relayx.com/u/${props.user?.paymail}`} size={46}/>
              </Link>
            </div>
            <div className="col-span-11 ml-6">
              <div className="flex">
              <Link 
                onClick={(e)=>e.stopPropagation()} 
                className='text-base leading-4 font-bold text-gray-900 dark:text-white cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis	hover:underline' 
                href={`/profile/${props.user?.paymail}`}>
                {props.user.name || `1${props.user.paymail.split('@')[0]}`}
              </Link>
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
                <img alt="berry" src={`https://berry.relayx.com/${props.jig.image}`} className="rounded-t-lg object-cover object-center"/>
                <div className="flex items-center p-2">
                  <div className="mr-2">
                    <Link onClick={(e:any)=> e.stopPropagation()}  href={`/profile/${props.jig.cls.user?.paymail}`}>
                      <UserIcon size={36} src={`https://a.relayx.com/u/${props.jig.cls.user?.paymail}`}/>
                    </Link>
                  </div>
                  <div className="grow">
                    <div className="flex flex-col">
                      <Link onClick={(e:any)=> e.stopPropagation()}  href={`/profile/${props.jig.cls.user?.paymail}`}>
                        <h2 className="cursor-pointer text-xl font-bold hover:underline">1{props.jig.cls.user?.paymail.split('@')[0]}</h2>
                      </Link>
                      <p className="">{props.jig.name} #{props.jig.no}/{props.jig.total}</p>
                    </div>
                  </div>
                  {props.jig.order && <div className="mr-5">
                    {props.jig.order.status === "sold" ? (
                      <div className="px-5 py-2 bg-red-600 rounded-2xl text-white">Sold</div>
                    ):(
                      <div onClick={handleBuy} className="px-5 py-2 bg-blue-600 rounded-2xl text-white text-center cursor-pointer">Buy {props.jig.order.satoshis * 1e-8}₿</div>
                    )}
                  </div>}
                </div>
              </div>
            </div>
          </div>
          <div className='flex w-full px-16'>
            <div className="grow"/>
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
                {props.replies.total}
              </p>
            </div>
            <BoostButton
                wallet={wallet}
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