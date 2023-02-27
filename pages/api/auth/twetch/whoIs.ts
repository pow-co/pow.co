import { GraphQLClient, gql } from "graphql-request";

const graphqlAPI = "https://gw.twetch.app"

export default async function whoIs(req:any, res: any) {
  const authToken = req.headers.authorization;

  const query = gql`
    query useAuthenticatedQuery {
      me {
        id
        icon
        name
        publicKey
      }
    }
  `;
  const graphqlClient = new GraphQLClient(graphqlAPI, {
    headers: {
      Authorization: authToken,
    },
  });
  try {
    const resp = await graphqlClient.request(query);
    res.status(200).json(resp);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
