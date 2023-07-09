import { GraphQLClient, gql } from 'graphql-request';
import { NextApiRequest, NextApiResponse } from 'next';

const graphqlAPI = 'https://gw.twetch.app';

export default async function latest(req: NextApiRequest, res: NextApiResponse) {
  const authToken = req.headers.authorization;
  let query;
  const { cursor } = req.query;
  if (!cursor) {
    query = gql`
      query GetLatestFeed {
        allPosts(first: 16, orderBy: CREATED_AT_DESC, filter: {bContent: {notStartsWith: "https://twetch."}}) {
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
      query GetLatestFeedPagination($cursor: Cursor!) {
        allPosts(first: 16, after: $cursor, orderBy: CREATED_AT_DESC) {
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
    // @ts-ignore
    headers: {
      Authorization: authToken,
    },
  });

  try {
    const result : any = await graphqlClient.request(query, { cursor });
    res.status(200).json({
      edges: result.allPosts.edges,
      pageInfo: result.allPosts.pageInfo,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}
