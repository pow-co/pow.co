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
import Meta from '../../../components/Meta'
import { getServerSideProps as getUserCardProps } from '.'

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
      const result : any = await request(graphqlAPI, query, { feed })

      return result.club
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    return getUserCardProps(context)
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
    <>
    <Meta title={`${props.userCard.userName}'s Profile | The Proof of Work Cooperative`} description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
    <ThreeColumnLayout>
        <div className="col-span-12 lg:col-span-6 min-h-screen mb-[200px]">
            <div className='mt-5 sm:mt-10'>
                <UserProfileCard {...props.userCard}/>
            </div>
            <div className="flex mt-6 mb-4 mx-0 px-4">
                <div className="flex">
                  <Link href={`/profile/${query.paymail}`}>
                    <div className="text-sm leading-4 py-2 px-3 text-gray-700 dark:text-gray-300 font-normal mr-2 cursor-pointer rounded-md whitespace-nowrap">
                      Feed
                    </div>
                  </Link>
                  <Link href={`/profile/${query.paymail}/boosts`}>
                    <div className="text-sm leading-4 py-2 px-3 text-gray-900 dark:text-white bg-primary-100 dark:bg-primary-600/20 font-medium mr-2 cursor-pointer rounded-md whitespace-nowrap">
                      Boosts
                    </div>
                  </Link>
                </div>
            </div>
            <div className='flex flex-col items-center justify-center'>
                <p className='text-5xl'>👀</p>
                <p className='text-3xl font-semibold text-center'>Coming soon ...</p>
            </div>
        </div>
    </ThreeColumnLayout>
    </>
  )
}

export default ProfilePage