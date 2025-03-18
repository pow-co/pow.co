import { Metadata, ResolvingMetadata } from 'next';
import React from 'react';
import axios from 'axios';
import { twetchDetailQuery, userProfileCardAnonQuery } from '../../../services/twetch';
import PostDetailCard from '../../../components/PostDetailCard';
import ThreeColumnLayout from '../../../components/v13_ThreeColumnLayout';
import BoostContentCardV2 from '../../../components/v13_BoostContentCardV2';

function parseURLsFromMarkdown(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls: string[] = text.match(urlRegex) || [];
    const regex = /(.*?)\]\((.*?)\)/; // Regular expression to match the Markdown link syntax
    const parsedUrls: string[] = [];
    
    // Using Array.forEach instead of for...of to avoid regenerator-runtime issue
    urls.forEach((url) => {
      const match = regex.exec(url);
  
      if (match && match.length >= 3) {
        parsedUrls.push(match[2]);
      } else {
        parsedUrls.push(url);
      }
    });
    
    return parsedUrls;
}

type Props = {
    params: { txid: string }
};

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
    difficulty?: number;
    tags?: BoostTag[];
    inReplyToTx?: string;
    replies?: TransactionDetails[];
    app?: string;
    createdAt?: Date;
}

async function getTransactionDetails(txid: string): Promise<TransactionDetails | null> {
    const [twetchResult, contentResponse, repliesResponse, onchainData] = await Promise.all([
        twetchDetailQuery(txid).catch((err) => console.log(err)),
        axios.get(`https://www.pow.co/api/v1/content/${txid}`),
        axios.get(`https://www.pow.co/api/v1/content/${txid}/replies`),
        axios.get(`https://onchain.sv/api/v1/events/${txid}`),
    ]);

    const { content } = contentResponse.data;
    const { tags } = contentResponse.data;
    const { events } = onchainData.data;
    const difficulty = tags.reduce((acc: number, curr: any) => acc + curr.difficulty, 0);
    let replies = repliesResponse.data.replies || [];
    let inReplyToTx = contentResponse.data.context_txid || null;

    let author; let textContent; let app; let 
createdAt;
    let urls: string[] = [];
    let files = [];
    
    if (twetchResult) {
        textContent = twetchResult.bContent;
        author = {
            name: twetchResult.userByUserId.name,
            paymail: `${twetchResult.userId}@twetch.me`,
            avatar: twetchResult.userByUserId.icon,
        };
        files = JSON.parse(twetchResult.files).map(async (fileTx:string) => {
            const src = `https://dogefiles.twetch.app/${fileTx}`;
            const response = await fetch(src); 
            const mime = response.headers.get("content-type");
            return {
                contentType: mime,
                content: src,

            };
        });
        urls = parseURLsFromMarkdown(textContent);
        inReplyToTx = twetchResult.postByReplyPostId?.transaction;
        replies = twetchResult.postsByReplyPostId?.edges?.map((node:any) => node.transaction);
        app = "twetch.com";
        createdAt = twetchResult.createdAt;
    } 
    if (content.bmap) {
        content.bmap.B.forEach((bContent: any) => {
            if (bContent['content-type'].includes("text")) {
                textContent = bContent.content;
                urls = parseURLsFromMarkdown(textContent);
            } else if (bContent["content-type"].includes("image")) {
                files.push({
                    contentType: bContent["content-type"],
                    content: bContent.content,
                });
            } else {
                console.log("unsuported content type");
            }
        });
        inReplyToTx = content.bmap.MAP[0].tx;
        createdAt = content.createdAt;
        const { paymail } = content.bmap.MAP[0];
        let avatar; let 
name;
        let twetchUserProfileCard;
        
        switch (true) {
            case paymail?.includes("relayx"):
              avatar = `https://a.relayx.com/u/${paymail}`;
              name = `1${paymail.split("@")[0]}`;
              break;
            case paymail?.includes("twetch"):
              avatar = `https://auth.twetch.app/api/v2/users/${
                paymail.split("@")[0]
              }/icon`;
              twetchUserProfileCard = await userProfileCardAnonQuery(paymail.split("@")[0]);
              name = twetchUserProfileCard.name;
              break;
            case paymail?.includes("handcash"):
              avatar = `https://cloud.handcash.io/v2/users/profilePicture/${
                paymail.split("@")[0]
              }`;
              name = `$${paymail.split("@")[0]}`;
              break;
            default:
              name = 'PoW observer';
              break;
          }
        author = {
            paymail,
            avatar,
            name,
        };
        app = content.bmap.MAP[0].app;
    }
    if (events) {
        events.forEach((evt:any) => {
            if (evt.type === "url") {
                urls.push(evt.content.url);
            }
        });
    }

    let previewUrls;
    console.log(urls);
    /* if(urls?.length > 0){
        urls?.forEach(async url => {
            
            let preview = await fetchPreview(url)
            previewUrls?.push(preview)
        })

    } */
    const txDetails: TransactionDetails = {
        txid,
        author,
        textContent,
        files,
        urls: previewUrls,
        difficulty,
        tags,
        inReplyToTx,
        replies,
        app,
        createdAt,
        
    };

    return txDetails;
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { txid } = params;

    const txDetails = await getTransactionDetails(txid);

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: txDetails?.author ? `${txDetails?.author.name} on Bitcoin` : 'PoW observer on Bitcoin',
        description: txDetails?.textContent ? txDetails.textContent : "This post lives forever on Bitcoin. Create a wallet and start discussing ideas now at pow.co",
        openGraph: {
            title: txDetails?.author ? `${txDetails?.author.name} on Bitcoin` : 'PoW observer on Bitcoin',
            description: txDetails?.textContent ? txDetails.textContent : "This post lives forever on Bitcoin. Create a wallet and start discussing ideas now at pow.co",
            url: "https://pow.co",
            siteName: 'PoW.co',
            images: [{
                // url: txDetails?.files![0].base64Content || "https://dogefiles.twetch.app/c3775f42d22ba9a68b5e134fd7b59b0c6060bf00a45e8890853b20e167e73a25",
                url: "https://dogefiles.twetch.app/c3775f42d22ba9a68b5e134fd7b59b0c6060bf00a45e8890853b20e167e73a25",
                width: 1200,
                height: 600,
            }, ...previousImages],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            title: txDetails?.author ? `${txDetails?.author.name} on Bitcoin` : 'PoW observer on Bitcoin',
            description: txDetails?.textContent ? txDetails.textContent : "This post lives forever on Bitcoin. Create a wallet and start discussing ideas now at pow.co",
            // images: [txDetails?.files![0].base64Content || "https://dogefiles.twetch.app/c3775f42d22ba9a68b5e134fd7b59b0c6060bf00a45e8890853b20e167e73a25", ...previousImages]
            images: ["https://dogefiles.twetch.app/c3775f42d22ba9a68b5e134fd7b59b0c6060bf00a45e8890853b20e167e73a25", ...previousImages],
        },
    };
}

const TransactionDetailPage = async ({
    params: { txid },
  }: {
    params: { txid: string }
  }) => {
    const details = await getTransactionDetails(txid);
  return (
    <ThreeColumnLayout>
        <div className="my-5 min-h-screen sm:my-10">
            {details?.inReplyToTx && <BoostContentCardV2 content_txid={details.inReplyToTx} />}
            <PostDetailCard details={details!} />
            {details?.replies?.map((reply) => (
              <BoostContentCardV2 key={reply.txid} content_txid={reply.txid} />
            ))}
        </div>
    </ThreeColumnLayout>
  );
};

export default TransactionDetailPage;
