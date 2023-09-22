import { Metadata, ResolvingMetadata } from 'next';
import React from 'react'
import { twetchDetailQuery } from '../../../services/twetch';
import axios from 'axios';
import { userProfileCardAnonQuery } from '../../../services/twetch';
import PostDetailCard from '../../../components/PostDetailCard';
import ThreeColumnLayout from '../../../components/v13_ThreeColumnLayout';
import BoostContentCardV2 from '../../../components/v13_BoostContentCardV2';


function parseURLsFromMarkdown(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls: string[] = text.match(urlRegex) || []
    const regex = /(.*?)\]\((.*?)\)/; // Regular expression to match the Markdown link syntax
    const parsedUrls: string[] = [];
    for (const url of urls!) {
      const match = regex.exec(url);
  
      if (match && match.length >= 3) {
        parsedUrls.push(match[2]);
      } else {
        parsedUrls.push(url);
      }
    }
    return parsedUrls;
}

const fetchPreview = async (url: string) => {
    let metadata: URLPreview = { url: url };
    try {
      let response = await axios.get(
        `https://link-preview-proxy.pow.co/v2?url=${url}`
      );
      metadata = response.data.metadata;
      metadata["url"] = url;
    } catch (error) {
      console.log(error);
    }
    return metadata;
  };

type Props = {
    params: { txid: string }
}

export const playerKeys = [
    "youtube",
    "youtu",
    "soundcloud",
    "facebook",
    "vimeo",
    "wistia",
    "mixcloud",
    "dailymotion",
    "twitch",
];

export function extractUrls(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex);
  }

export function normalizeUrls(urls: string[]): string[] {
    const normalizedUrls: string[] = [];
  
    for (const url of urls) {
      let normalizedUrl = url;
  
      // Remove the "m." subdomain from the URL
      normalizedUrl = normalizedUrl.replace(/m\./i, "");
  
      normalizedUrls.push(normalizedUrl);
    }
  
    return normalizedUrls;
}

interface Player {
    id?: number,
    name?: string;
    paymail?: string;
    avatar?: string;
    banner?:string;
    bio?: string;
}

interface BitcoinFile {
    contentType: string;
    content: string;
    txid?: string;
}

interface BoostTag {
    utf8: string;
    hex?: string;
    difficulty: number;
}

export interface URLPreview {
    url: string;
    image?: string;
    description?: string;
}

export interface TransactionDetails {
    txid: string;
    author?: Player;
    textContent?: string;
    files?: BitcoinFile[];
    urls?: URLPreview[];
    playableURLs?: string[];
    tweetId?: string;
    difficulty?: number;
    tags?: BoostTag[];
    inReplyToTx?: string;
    replies?: TransactionDetails[];
    app?: string;
    createdAt?: Date;
    json?: any;
    smartContractClass?: string;
}

async function getTransactionDetails(txid: string): Promise<TransactionDetails | null> {
    
    const [twetchResult, contentResponse, repliesResponse, onchainData, issueResponse, videoResponse] = await Promise.all([
        twetchDetailQuery(txid).catch((err) => console.log(err)),
        axios.get(`https://pow.co/api/v1/content/${txid}`).catch((err) => {
            return { data: {}}
        }),
        axios.get(`https://pow.co/api/v1/content/${txid}/replies`).catch((err) => {
            return { data: {}}
        }),
        axios.get(`https://onchain.sv/api/v1/events/${txid}`).catch((err) => {
            return { data: {}}
        }),
        axios.get(`https://pow.co/api/v1/issues/${txid}`).catch((err) => {
            return { data: null}
        }),
        axios.get(`https://hls.pow.co/api/v1/videos/${txid}`).catch((err) =>{
            return { data: null}
        })
    ])

    let { content } = contentResponse.data || {}
    let issue = issueResponse.data
    let video = issueResponse.data
    let { tags } = contentResponse.data
    let { events } = onchainData.data;
    let difficulty = tags?.reduce((acc: number, curr: any) => acc + curr.difficulty, 0) || 0
    let replies = repliesResponse.data.replies || []
    let inReplyToTx = contentResponse.data.context_txid || null

    let author, textContent, app, createdAt, json, smartContractClass, tweetId;
    let urls: string[] = []
    let playableURLs: string[] = []
    let files: BitcoinFile[] = []
    let previewURLs: URLPreview[] = []
    
    if (twetchResult){
        textContent = twetchResult.bContent
        author = {
            name: twetchResult.userByUserId.name,
            paymail: `${twetchResult.userId}@twetch.me`,
            avatar: twetchResult.userByUserId.icon,
        }
        twetchResult.files && JSON.parse(twetchResult.files).map(async (fileTx:string) => {
            let src = `https://dogefiles.twetch.app/${fileTx}`
            let response = await fetch(src) 
            let mime = response.headers.get("content-type")
            files.push({
                contentType: mime!,
                content: src,
                txid: fileTx

            })
        })
        urls = parseURLsFromMarkdown(textContent)
        for (const url of urls){
            const preview = await fetchPreview(url)
            previewURLs.push(preview)
        }
        inReplyToTx = twetchResult.postByReplyPostId?.transaction
        twetchResult.postsByReplyPostId?.edges?.map((node:any) => {
            replies.push({txid: node.node.transaction})
        })
        app = "twetch.com"
        createdAt = twetchResult.createdAt
    } else if (issue) {
        smartContractClass = 'issue'
        json = issue
        createdAt = issue.origin.createdAt
    } else if (content.content_type?.includes("calendar")){
        json = content.content_json
        smartContractClass = 'calendar'
        createdAt = content.createdAt
    } else if (video) {
        try {
            await axios.head(`https://hls.pow.co/${video.sha256Hash}.m3u8`)
            playableURLs.push(`https://hls.pow.co/${video.sha256Hash}.m3u8`) 
        } catch (error) {
            playableURLs.push(`https://hls.pow.co/${video.sha256Hash}.mp4`)
        } 
    } else if (content.bmap && content.bmap.B && content.bmap.MAP[0]){
        //content.bmap.B.forEach(async (bContent: any) => {
        for (const bContent of content.bmap.B){    
            if (bContent['content-type'].includes("text")){
                textContent = bContent.content
                urls = extractUrls(textContent) || []
                urls = parseURLsFromMarkdown(textContent)
                urls = normalizeUrls(urls);
                console.log("URLS",urls)
                for (const url of urls){
                    const preview = await fetchPreview(url)
                    previewURLs.push(preview)
                }
            } else if (bContent["content-type"].includes("image")) {
                files.push({
                    contentType: bContent["content-type"],
                    content: bContent.content
                })
            } else {
                console.log("unsuported content type")
            }
        };
        inReplyToTx = content.bmap.MAP[0].tx
        createdAt = content.createdAt
        let paymail = content.bmap.MAP[0].paymail
        let avatar, name;
        switch (true) {
            case paymail?.includes("relayx"):
              avatar =  `https://a.relayx.com/u/${paymail}`;
              name = `1${paymail.split("@")[0]}`
              break;
            case paymail?.includes("twetch"):
              avatar =  `https://auth.twetch.app/api/v2/users/${
                paymail.split("@")[0]
              }/icon`;
              let twetchUserProfileCard = await userProfileCardAnonQuery(paymail.split("@")[0])
              name = twetchUserProfileCard.name
              break;
            case paymail?.includes("handcash"):
              avatar =  `https://cloud.handcash.io/v2/users/profilePicture/${
                paymail.split("@")[0]
              }`;
              name = `$${paymail.split("@")[0]}`
              break;
            default:
              name = 'PoW observer'
              break;
          }
        author = {
            paymail,
            avatar,
            name
        }
        app = content.bmap.MAP[0].app
    } else if (events){
        createdAt = events[0].createdAt
        for (const ev of events){
            if (ev.type === "url") {
            if (ev.content.url.match(/.m3u8$/)) {
                console.log("PLAYABLE URL", ev.content.url)
                playableURLs.push(ev.content.url as string)
            } else if (playerKeys.some((key) => ev.content.url.includes(key))) {
                let normalizedUrls = normalizeUrls([ev.content.url]);
                normalizedUrls.forEach(url => {
                    playableURLs.push(url)
                });
              } else if (ev.content.url.includes("twitter")) {
                tweetId = ev.content.url.split("/").pop();
              } else {
                const preview = await fetchPreview(ev.content.url)
                  previewURLs.push(preview);
              }
            }
        };
    }

    const txDetails: TransactionDetails = {
        txid,
        author,
        textContent,
        files,
        urls: previewURLs,
        playableURLs,
        tweetId,
        difficulty,
        tags,
        inReplyToTx,
        replies,
        app,
        createdAt,
        json,
        smartContractClass
    }

    return txDetails
}

export async function generateMetadata({params}: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const txid = params.txid

    const txDetails = await getTransactionDetails(txid)

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    return {
        title: txDetails?.author ? `${txDetails?.author.name} on Bitcoin` : 'PoW observer on Bitcoin',
        description: txDetails?.textContent ? txDetails.textContent : "This post lives forever on Bitcoin. Create a wallet and start discussing ideas now at pow.co",
        openGraph: {
            title: txDetails?.author ? `${txDetails?.author.name} on Bitcoin` : 'PoW observer on Bitcoin',
            description: txDetails?.textContent ? txDetails.textContent : "This post lives forever on Bitcoin. Create a wallet and start discussing ideas now at pow.co",
            url:"https://pow.co",
            siteName: 'PoW.co',
            images: [{
                //url: txDetails?.files![0].base64Content || "https://dogefiles.twetch.app/c3775f42d22ba9a68b5e134fd7b59b0c6060bf00a45e8890853b20e167e73a25",
                url: "https://dogefiles.twetch.app/c3775f42d22ba9a68b5e134fd7b59b0c6060bf00a45e8890853b20e167e73a25",
                width: 1200,
                height: 600
            }, ...previousImages],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            title: txDetails?.author ? `${txDetails?.author.name} on Bitcoin` : 'PoW observer on Bitcoin',
            description:txDetails?.textContent ? txDetails.textContent : "This post lives forever on Bitcoin. Create a wallet and start discussing ideas now at pow.co",
            //images: [txDetails?.files![0].base64Content || "https://dogefiles.twetch.app/c3775f42d22ba9a68b5e134fd7b59b0c6060bf00a45e8890853b20e167e73a25", ...previousImages]
            images: ["https://dogefiles.twetch.app/c3775f42d22ba9a68b5e134fd7b59b0c6060bf00a45e8890853b20e167e73a25", ...previousImages]
        }
    }
}

const TransactionDetailPage = async ({
    params: { txid },
  }: {
    params: { txid: string }
  }) => {

    const details = await getTransactionDetails(txid)

  return (
    <ThreeColumnLayout>
        <div className='my-5 sm:my-10 min-h-screen'>
            {details?.inReplyToTx && <BoostContentCardV2 content_txid={details.inReplyToTx} />}
            {<PostDetailCard details={details!}/>}
            {details?.replies?.map((reply) => <BoostContentCardV2 content_txid={reply.txid}/>)}
        </div>
    </ThreeColumnLayout>
  )
}

export default TransactionDetailPage
