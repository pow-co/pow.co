import { GraphQLClient, gql } from "graphql-request";
import { NextApiRequest, NextApiResponse } from "next";

const graphqlAPI =  'https://gw.twetch.app';

export default async function search(req: NextApiRequest, res: NextApiResponse){
    let query;
    let { searchTerm, orderBy, from, cursor } = req.query;
    
    if (!orderBy){
        orderBy = "CREATED_AT_DESC"
    }
    if (!cursor){
        //@ts-ignore
        cursor = null
    }
    if (!from){
        query = gql`
            query GetSearchResults(
                $searchTerm: String
                $orderBy: [PostsOrderBy!]
                $cursor: Cursor
                ) {
                allPosts(
                    first: 16
                    orderBy: $orderBy
                    filter: { bContent: { includesInsensitive: $searchTerm } }
                    after: $cursor
                ) {
                    edges {
                    node {
                        bContent
                        createdAt
                        files
                        numLikes
                        numBranches
                        postsByReplyPostId {
                        totalCount
                        }
                        userId
                        userByUserId {
                        icon
                        name
                        }
                        transaction
                    }
                    }
                    pageInfo {
                    endCursor
                    hasNextPage
                    }
                }
            }
        `
    } else {

        query = gql`
            query GetSearchResults(
                $searchTerm: String
                $from: BigInt
                $orderBy: [PostsOrderBy!]
                $cursor: Cursor
                ) {
                allPosts(
                    first: 16
                    orderBy: $orderBy
                    filter: { bContent: { includesInsensitive: $searchTerm } }
                    condition: { userId: $from }
                    after: $cursor
                ) {
                    edges {
                    node {
                        bContent
                        createdAt
                        files
                        numLikes
                        numBranches
                        postsByReplyPostId {
                        totalCount
                        }
                        userId
                        userByUserId {
                        icon
                        name
                        }
                        transaction
                    }
                    }
                    pageInfo {
                    endCursor
                    hasNextPage
                    }
                }
            }
        `
    }

    const graphqlClient = new GraphQLClient(graphqlAPI)

    try {
        let params = !from ? { searchTerm, orderBy, cursor} : { searchTerm, orderBy, from, cursor}
        console.log(params)
        //@ts-ignore
        const result: any = await graphqlClient.request(query, params)
        res.status(200).json({
            edges: result.allPosts.edges,
            pageInfo: result.allPosts.pageInfo
        })
    } catch (error) {
        console.log("twetch.search.error", error)
        res.status(500).send(error)
    }
    
}