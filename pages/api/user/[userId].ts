import { GraphQLClient, gql } from "graphql-request";
import { NextApiRequest, NextApiResponse } from "next";

const graphqlAPI = "https://gw.twetch.app";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authToken = req.headers.authorization;
  let query;
  const { userId, cursor } = req.query;
  if (!cursor) {
    query = gql`
      query userProfileLatestFeed($userId: BigInt!) {
        allPosts(
          condition: { userId: $userId, status: "0" }
          first: 16
          orderBy: CREATED_AT_DESC
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
              youBranchedCalc
              youLikedCalc
              transaction
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `;
  } else {
    query = gql`
      query userProfileLatestFeedPagination(
        $userId: BigInt!
        $cursor: Cursor!
      ) {
        allPosts(
          condition: { userId: $userId, status: "0" }
          after: $cursor
          first: 16
          orderBy: CREATED_AT_DESC
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
              youBranchedCalc
              youLikedCalc
              transaction
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `;
  }

  const graphqlClient = new GraphQLClient(graphqlAPI, {
    //@ts-ignore
    headers: {
      Authorization: authToken,
    },
  });

  try {
    const result : any = await graphqlClient.request(query, { userId, cursor });
    res.status(200).json({
      edges: result.allPosts.edges,
      pageInfo: result.allPosts.pageInfo,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}
