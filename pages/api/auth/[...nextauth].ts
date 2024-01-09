import NextAuth from 'next-auth';
import Twitter from 'next-auth/providers/twitter';

export default NextAuth({
  providers: [
    Twitter({
      clientId: String(process.env.TWITTER_CLIENT_ID),
      clientSecret: String(process.env.TWITTER_CLIENT_SECRET),
      version: "2.0",
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "users.read tweet.read offline.access tweet.write",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Attach the Twitter access token and secret to the session
      console.log("TOKEN", token);

      return session;
    },
    async jwt({
 token, user, account, profile, isNewUser, 
}) {
      console.log("JWT", token, user, account, profile, isNewUser);
      return token;
    },
  },
});
