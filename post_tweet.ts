import axios, { AxiosResponse } from 'axios';

// Function to post a tweet using Twitter API
async function postTweet(accessToken: string, tweetText: string): Promise<AxiosResponse> {
  const apiUrl = 'https://api.twitter.com/2/tweets';

    const response = await axios.post(
      apiUrl,
      {
        text: tweetText,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response;
}

// Example usage
const userAccessToken = process.env.TWITTER_ACCESS_TOKEN;
const tweetContent = 'Hello, Twitter from TypeScript!';

postTweet(userAccessToken, tweetContent)
  .then((response) => {
    console.log('Tweet posted successfully:', response.data);
  })
  .catch((error) => {
    console.error('Error posting tweet:', error);
  });
