import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import ThreeColumnLayout from '../../../components/ThreeColumnLayout'
import UserProfileCard from '../../../components/UserProfileCard'
import { TwetchCard } from '../../../components/Twetch'
import { RelayClubCard } from '../../../components/RelayClub'
import Loader from '../../../components/Loader'
import { useRouter } from 'next/router'
import InfiniteScroll from "react-infinite-scroll-component";
import { userProfileCardAnonQuery, userProfileLatestFeedQuery, userProfileLatestFeedPaginationQuery } from '../../../services/twetch'
import { GetServerSideProps } from 'next'
import { UserProfileCardProps } from '../../../components/UserProfileCard'
import axios from 'axios'
import request from 'graphql-request'
import { useRelay } from '../../../context/RelayContext'
import { useBitcoin } from '../../../context/BitcoinContext'

const graphqlAPI = "https://graphql.relayx.com";

export const relayFeedQuery = async (feed: string) => {
    const query = `
    query ($feed: String!) {
        club(feed: $feed) {
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
          __typename
        }
      }`
      const result: any = await request(graphqlAPI, query, { feed })

      return result.club
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const query = context.query;
    const paymail = query.paymail?.toString()
    let userCard = {
      banner: "",
      avatar:"",
      userName:"",
      paymail:"",
      description: "",
      url:""
    };

    if(!paymail){
        return { props: { userCard: null}}
    }
    const isTwetchUser = paymail?.includes("twetch")
    const isRelayXUser = paymail?.includes("relayx")
    const isHandcashUser = paymail?.includes("handcash")
    const isSensiletUser = paymail?.includes("sensilet")
    const isLocalUser = paymail?.includes("pow.co")

    if (isTwetchUser){
        const userId = parseInt(paymail.split("@")[0])
        const twetchUserProfileCard = await userProfileCardAnonQuery(userId);
        userCard = {
            banner: twetchUserProfileCard.banner,
            avatar: twetchUserProfileCard.icon,
            userName: twetchUserProfileCard.name,
            paymail: `${twetchUserProfileCard.id}@twetch.me`,
            description: twetchUserProfileCard.description,
            url: twetchUserProfileCard.profileUrl
        }
    } 

    if (isRelayXUser){
        const relayXUserProfileCardResponse = await axios.get(`https://staging-backend.relayx.com/api/profile/${paymail}`)
        const relayXUserProfileCard = relayXUserProfileCardResponse.data.data
        userCard = {
            banner: "",
            avatar: `https://a.relayx.com/u/${paymail}`,
            userName: relayXUserProfileCard.profile ? relayXUserProfileCard.profile?.name : `1${paymail.split("@")[0]}` ,
            paymail: relayXUserProfileCard.profile ? `1${relayXUserProfileCard.profile?.paymail.split("@")[0]}` : "",
            description: relayXUserProfileCard.profile ? relayXUserProfileCard.profile?.bio : "",
            url: relayXUserProfileCard.profile ? relayXUserProfileCard.profile?.website : ""
        } 
        
    }

    if (isHandcashUser){
      // LMAO someone explain Hadcash guys the concept of *public* profiles
      /* const handCashConnect = new HandCashConnect({ 
        appId: '<app-id>', 
        appSecret: '<secret>',
      }); 
      let token='<handcash auth token>'
      const account = handCashConnect.getAccountFromAuthToken(token);
      const handcashUserProfileCardResponse = await account.profile.getPublicProfilesByHandle(users);
      console.log(handcashUserProfileCardResponse); */
      userCard = {
        banner: "",
        avatar: `https://cloud.handcash.io/v2/users/profilePicture/${paymail}`,
        userName:`$${paymail.split('@')[0]}`,
        paymail: paymail,
        description: "",
        url:""
      }
    }

    if (isSensiletUser){
      userCard = {
        banner: "",
        avatar:`https://api.dicebear.com/6.x/pixel-art/svg?seed=${paymail}`,
        userName: paymail.split('@')[0],
        paymail:paymail,
        description: "",
        url:""
      };      

    }

    if (isLocalUser) {
      userCard = {
        banner: "",
        avatar:`https://api.dicebear.com/6.x/pixel-art/svg?seed=${paymail}`,
        userName: paymail.split('@')[0],
        paymail:paymail,
        description: "",
        url:""
      }; 
    }

    return { props: { userCard } };
}

interface ProfileCardProps {
    userCard: UserProfileCardProps
}

const ProfilePage = (props: ProfileCardProps ) => {
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [cursor, setCursor] = useState("");
    const router = useRouter();
    const query = router.query;
    const paymail = query.paymail?.toString()
    const isTwetchUser = paymail?.includes("twetch")
    const isRelayXUser = paymail?.includes("relayx")

    useEffect(() => {
        if (isTwetchUser){
            const userId = parseInt(paymail!.split("@")[0])
            userProfileLatestFeedQuery(userId).then((data) => {
              setPosts(data.edges.map((post: any) => post.node));
              setHasMore(data.pageInfo.hasNextPage);
              setCursor(data.pageInfo.endCursor);
            });
        }

        if (isRelayXUser){
            relayFeedQuery(paymail!).then((data) => {
                setPosts(data)
                setHasMore(false)
                setCursor("")
            })
        }
      }, [paymail]);
    
      const refresh = async () => {
        setPosts([]);
        setCursor("");
        setHasMore(true);
        if (isTwetchUser){
            const userId = parseInt(paymail!.split("@")[0])
            userProfileLatestFeedQuery(userId).then((data) => {
              setPosts(data.edges.map((post: any) => post.node));
              setHasMore(data.pageInfo.hasNextPage);
              setCursor(data.pageInfo.endCursor);
            });
        }
      };
    
      const fetchMore = async () => {
        if(isTwetchUser){
            const userId = parseInt(paymail!.split("@")[0])
            cursor &&
              userProfileLatestFeedPaginationQuery(userId, cursor).then((data) => {
                setPosts(posts.concat(data.edges.map((post: any) => post.node)));
                setHasMore(data.pageInfo.hasNextPage);
                setCursor(data.pageInfo.endCursor);
              });
        }
      };

      
  return (
    <ThreeColumnLayout>
        <div className="col-span-12 lg:col-span-6 min-h-screen mb-[200px]">
            <div className='mt-5 sm:mt-10'>
                <UserProfileCard {...props.userCard}/>
            </div>
            <div className="flex mt-6 mb-4 mx-0 px-4">
                <div className="flex">
                  <Link href={`/profile/${query.paymail}`}>
                    <div className="text-sm leading-4 py-2 px-3 text-gray-900 dark:text-white bg-primary-100 dark:bg-primary-600/20 font-medium mr-2 cursor-pointer rounded-md whitespace-nowrap">
                      Feed
                    </div>
                  </Link>
                  <Link href={`/profile/${query.paymail}/boosts`}>
                    <div className="text-sm leading-4 py-2 px-3 text-gray-700 dark:text-gray-300 font-normal mr-2 cursor-pointer rounded-md whitespace-nowrap">
                      Boosts
                    </div>
                  </Link>
                </div>
            </div>
            <div className="w-full">
                <div className="relative">
                    <InfiniteScroll
                    dataLength={posts.length}
                    hasMore={hasMore}
                    next={fetchMore}
                    loader={<div className='mt-5 sm:mt-10'>
                        <Loader />
                        </div>}
                    pullDownToRefresh
                    pullDownToRefreshThreshold={50}
                    refreshFunction={refresh}
                    >
                        <div>
                            {posts.map((post: any) => {
                                if (isTwetchUser){
                                    return <TwetchCard key={post.transaction} {...post} difficulty={0}/>
                                }
                                if (isRelayXUser){
                                    return <RelayClubCard key={post.txid} {...post} difficulty={0}/>
                                }
                                }
                            )}
                        </div>
                    </InfiniteScroll>
                </div>
          </div>
        </div>
    </ThreeColumnLayout>
  )
}

export default ProfilePage