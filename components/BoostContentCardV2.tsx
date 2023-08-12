import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import UserIcon from "./UserIcon";
import moment from "moment";
import { Tooltip } from "react-tooltip";
import { useBitcoin } from "../context/BitcoinContext";
import { toast } from "react-hot-toast";
import BoostButton from "./BoostpowButton/BoostButton";
import axios from "axios";
import { BASE } from "../hooks/useAPI";
import { useTheme } from "next-themes";
import { useTuning } from "../context/TuningContext";
import { FormattedMessage } from "react-intl";
import Linkify from "linkify-react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { youtubePlayerOpts } from "./YoutubeMetadataOnchain";
import Youtube from "react-youtube";
import { twetchDetailQuery } from "./Twetch";
import { NFTJig, relayDetailQuery } from "./RelayClub";
import ReactPlayer from "react-player/lazy";
import Meta from "./Meta";
import LoveOrdButton from "./LoveOrdButton";
import { useRelay } from "../context/RelayContext";

const Markdown = require("react-remarkable");

const RemarkableOptions = {
  breaks: true,
  html: true,
  linkify: true,
  linkTarget: "_blank",
  typographer: true,
  /* highlight: function (str: any, lang: any) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (err) {}
        }
  
        try {
          return hljs.highlightAuto(str).value;
        } catch (err) {}
  
        return ''; // use external default escaping
      } */
};

export const BFILE_REGEX = /b:\/\/([a-fA-F0-9]{64})/g;

const youtubeLinkRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

function parseURLsFromMarkdown(urls: string[]) {
  const regex = /(.*?)\]\((.*?)\)/; // Regular expression to match the Markdown link syntax
  const parsedUrls: string[] = [];
  for (const url of urls) {
    const match = regex.exec(url);

    if (match && match.length >= 3) {
      parsedUrls.push(match[2]);
    } else {
      parsedUrls.push(url);
    }
  }
  return parsedUrls;
}

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

export const fetchPreview = async (url: string) => {
  let metadata = { url: url };
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

export interface Ranking {
  content_txid: string;
  content_text?: string;
  content_type?: string;
  count?: number;
  difficulty?: number;
  createdAt?: Date;
  rank?: number;
  defaultTag?: string;
}

const BoostContentCardV2 = ({
  content_txid,
  difficulty,
  rank,
  defaultTag,
}: Ranking) => {
  const router = useRouter();
  const { wallet } = useBitcoin();
  const { hasTwetchPrivilege } = useRelay();
  const theme = useTheme();
  const { filter } = useTuning();
  const [loading, setLoading] = useState<boolean>(true);
  const gradient = "from-pink-400 to-violet-600";
  const [computedDiff, setComputedDiff] = useState<number>(difficulty || 0);
  const [paymail, setPaymail] = useState("");
  const [userName, setUserName] = useState("");
  const [isTwetch, setIsTwetch] = useState(false);
  const [hlsVideoUrl, setHlsVideoUrl] = useState<string | undefined>();
  const avatar = useMemo(() => {
    switch (true) {
      case paymail?.includes("relayx"):
        return `https://a.relayx.com/u/${paymail}`;
      case paymail?.includes("twetch"):
        return `https://auth.twetch.app/api/v2/users/${
          paymail.split("@")[0]
        }/icon`;
      case paymail?.includes("handcash"):
        return `https://cloud.handcash.io/v2/users/profilePicture/${
          paymail.split("@")[0]
        }`;
      default:
        return "";
    }
  }, [paymail]);
  const filterLabel = useMemo(() => {
    switch (filter) {
      case "last-hour":
        return <FormattedMessage id="Last Hour" />;
      case "last-day":
        return <FormattedMessage id="Last Day" />;
      case "last-week":
        return <FormattedMessage id="Last Week" />;
      case "last-month":
        return <FormattedMessage id="Last Month" />;
      case "last-year":
        return <FormattedMessage id="Last Year" />;
      default:
        return <FormattedMessage id="All" />;
    }
  }, [filter]);
  const [inReplyTo, setInReplyTo] = useState("");
  const [timestamp, setTimestamp] = useState<number>(0);
  const [tags, setTags] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [contentText, setContentText] = useState("");
  const [channel, setChannel] = useState("");
  const [postMedia, setPostMedia] = useState<any[]>([]);
  const [linkUnfurls, setLinkUnfurls] = useState<any[]>([]);
  const [tweetId, setTweetId] = useState<string>("");
  const [youtubeId, setYoutubeId] = useState("");
  const [playerURLs, setPlayerURLs] = useState<string[]>([]);
  const [jig, setJig] = useState(null);
  const existingTags = useMemo(
    () =>
      tags
        ?.map((tag: any) => {
          if (
            tag.hex !== "0000000000000000000000000000000000000000" &&
            tag.utf8.length
          ) {
            return tag.utf8;
          }
        })
        .filter((tag) => tag !== undefined),
    [tags]
  );

  useEffect(() => {
    getData().then((res) => {
      parseContent(res.content);
      setTags(res.tags);
      if (!difficulty && res.tags) {
        setComputedDiff(
          res.tags.reduce((acc: number, curr: any) => acc + curr.difficulty, 0)
        );
      }
      setCommentCount(res.replies.length);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (contentText) {
      let urls: string[] = extractUrls(contentText) || [];
      urls = parseURLsFromMarkdown(urls);
      urls = normalizeUrls(urls);
      const urlSet = [...new Set(urls)];
      urlSet.forEach((url) => {
        if (playerKeys.some((key) => url.includes(key))) {
          setPlayerURLs((prev) => [...prev, url]);
        } else if (url.includes("twitter")) {
          setTweetId(url.split("/").pop() || "");
        } else {
          fetchPreview(url).then((res) => {
            setLinkUnfurls((prev: any) => [...prev, res]);
          });
        }
      });
    }
  }, [contentText]);

  const parseContent = async (content: any) => {
    console.log(content);

    if (content.bmap) {
      if (content.bmap.B && content.bmap.MAP) {
        if (content.bmap.MAP[0].app === "twetch") {
          console.log("this is a twetch");
          twetchDetailQuery(content_txid).then((res) => {
            console.log(res);
            setContentText(res.bContent || "");
            setPaymail(`${res.userId}@twetch.me`);
            setUserName(res.userByUserId.name);
            setPostMedia(JSON.parse(res.files) || []);
            setInReplyTo(res.postByReplyPostId?.transaction || "");
            setTimestamp(moment(res.createdAt).unix());
            setCommentCount(res.postsByReplyPostId.totalCount);
            setIsTwetch(true);
          });
        } else if (
          content.bmap.MAP[0].app == "relayclub" &&
          content.bmap.MAP[0].context === "club"
        ) {
          relayDetailQuery(content_txid).then((res) => {
            console.log(res);
            setContentText(res.text);
            setPaymail(res.user.paymail);
            setTimestamp(res.time);
            setCommentCount(res.replies.total);
            setJig(res.jig);
          });
        } else {
          content.bmap.B.forEach((bContent: any) => {
            if (bContent["content-type"].includes("text")) {
              setContentText(bContent.content);
            } else if (bContent["content-type"].includes("image")) {
              setPostMedia((prev: any) => {
                if (!prev.includes(bContent.content)) {
                  return [...prev, bContent.content];
                }
                return prev;
              });
            } else {
              console.log("unsupported content type");
            }
          });
          setPaymail(content.bmap.MAP[0].paymail);
          setInReplyTo(content.bmap.MAP[0].tx || "");
          setChannel(content.bmap.MAP[0].channel || "");
          setTimestamp(moment(content.createdAt).unix());
        }
      } else {
        //console.log("BMAP without B nor MAP", content)
        if (content.bmap.twetch) {
          twetchDetailQuery(content_txid).then((res) => {
            setContentText(res.bContent || "");
            setPaymail(`${res.userId}@twetch.me`);
            setUserName(res.userByUserId.name);
            setPostMedia(JSON.parse(res.files) || []);
            setInReplyTo(res.postByReplyPostId?.transaction || "");
            setTimestamp(moment(res.createdAt).unix());
            setCommentCount(res.postsByReplyPostId.totalCount);
            setIsTwetch(true);
          });
          /* setLinkUnfurls([{
                        url: `https://twetch.com/t/${content_txid}`,
                        image: 'https://pbs.twimg.com/card_img/1653550875279851526/c2a7LseN?format=jpg&name=medium',
                        description: 'Encrypted Twetch content'
                    }]) */
        }

        if (content.bmap.ORD) {
          console.log("HERE", content);
          setTimestamp(moment(content.createdAt).unix());
          content.bmap.ORD.map((ordi: any) => {
            //console.log(ordi)
            if (ordi.contentType.includes("image")) {
              setPostMedia((prev: any) => {
                if (!prev.includes(ordi.data)) {
                  return [...prev, ordi.data];
                }
                return prev;
              });
            }
          });
        }
      }
    } else {
      //console.log("EMPTY BMAP", content)
      setTimestamp(moment(content.createdAt).unix());
      switch (true) {
        case content.content_type?.includes("application/json"):
          // onchainsv
          let onchainData = await axios.get(
            `https://onchain.sv/api/v1/events/${content_txid}`
          );
          let { events } = onchainData.data;
          events.forEach((ev: any) => {
            if (ev.type === "url") {
              if (playerKeys.some((key) => ev.content.url.includes(key))) {
                let normalizedUrl = normalizeUrls([ev.content.url]);
                setPlayerURLs(normalizedUrl);
              } else if (ev.content.url.includes("twitter")) {
                setTweetId(ev.content.url.split("/").pop());
              } else {
                fetchPreview(ev.content.url).then((res) => {
                  setLinkUnfurls([res]);
                });
              }
              if (ev.content.url.match(/.m3u8$/)) {
                setHlsVideoUrl(ev.content.url)
              }
            }
          });
          break;
        case content.content_type?.includes("text"):
          if (!content.content_text) {
            break;
          } else {
            setContentText(content.content_text);
            break;
          }
        case content.content_type?.includes("image"):
          setPostMedia((prev: any) => {
            if (!prev.includes(content.content_text)) {
              return [...prev, content.content_text];
            }
            return prev;
          });
          break;
        default:
          console.log("unknown content type");
      }
    }
  };

  const getData = async () => {
    const [contentResult, repliesResult] = await Promise.all([
      axios.get(`${BASE}/content/${content_txid}`).catch((err) => {
        console.error("api.content.fetch.error", err);
        return { data: { content: {} } };
      }),
      axios.get(`${BASE}/content/${content_txid}/replies`).catch((err) => {
        console.error("api.replies.fetch.error", err);
        return { data: { replies: [] } };
      }),
    ]);

    const { content } = contentResult.data;
    const { tags } = contentResult.data;
    const replies = repliesResult.data.replies || [];

    return { content, tags, replies };
  };

  if (loading) {
    return (
      <div className="mt-0.5 p-4 bg-primary-100 dark:bg-primary-600/20">
        <div role="status" className="grid grid-cols-12 animate-pulse">
          <div className="col-span-1">
            <div className="h-8 w-8 justify-start bg-gray-300 rounded-full dark:bg-gray-700" />
          </div>
          <div className="w-full col-span-11 ml-3 md:ml-6">
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-44 mb-4"></div>
            <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[380px] mb-2.5"></div>
            <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[380px] mb-2.5"></div>
            <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
            <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[370px] mb-2.5"></div>
            <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[330px]"></div>
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  const navigate = (e: any) => {
    e.stopPropagation();
    router.push(`/${content_txid}`);
  };

  return (
    <>
      {(router.pathname !== "/" || router.pathname.startsWith("/topics")) && (
        <Meta
          title="Post Detail | The Proof of Work Cooperative"
          description={
            contentText.length > 0
              ? contentText
              : "People Coordinating Using Costly Signals"
          }
          image={
            postMedia.length > 0
              ? isTwetch
                ? `https://dogefiles.twetch.app/${postMedia[0]}`
                : `data:image/jpeg;base64,${postMedia[0]}`
              : "https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557"
          }
        />
      )}
      <div
        onClick={navigate}
        className="mt-0.5 grid grid-cols-12 bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 first:md:rounded-t-lg last:md:rounded-b-lg"
      >
        <div className="col-span-12 px-4 pt-4">
          <p className="text-2xl font-semibold">
            <span
              className={`bg-gradient-to-br bg-clip-text text-transparent ${gradient}`}
            >
              {computedDiff.toFixed(4)}
            </span>
            <span className="ml-1">⛏️</span>
          </p>
        </div>
        {inReplyTo.length > 0 && router.pathname === "/" && (
          <p className="col-span-12 overflow-hidden text-ellipsis px-4 pt-3 text-sm italic text-gray-600 dark:text-gray-400">
            in reply to{" "}
            <span className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
              <Link href={`/${inReplyTo}`}>{inReplyTo}</Link>
            </span>
          </p>
        )}
        {channel.length > 0 && (
          <p className="col-span-12 overflow-hidden text-ellipsis px-4 pt-3 text-sm italic text-gray-600 dark:text-gray-400">
            in channel{" "}
            <span className="text-primary-600 dark:text-primary-400 hover:underline">
              <Link href={`/chat/${channel}`}>{channel}</Link>
            </span>
          </p>
        )}
        <div className="col-span-12 max-w-screen mb-0.5 grid cursor-pointer grid-cols-12 items-start px-4 pt-4">
          <div className="col-span-1 flex h-full w-full flex-col justify-center">
            {paymail && (
              <Link
                className="justify-start"
                onClick={(e: any) => e.stopPropagation()}
                href={`/profile/${paymail}`}
              >
                <UserIcon src={avatar} size={46} />
              </Link>
            )}
            <div className="grow" />
            {rank && (
              <p className="text-center">
                <span className={`${rank < 4 ? "font-semibold" : "italic"}`}>
                  #{rank}
                </span>{" "}
                {filterLabel}
              </p>
            )}
            <div className="grow" />
          </div>
          <div className="col-span-11 ml-6">
            <div className="flex">
              <div className="truncate">
                {paymail && (
                  <Link
                    href={`/profile/${paymail}`}
                    onClick={(e: any) => e.stopPropagation()}
                  >
                    {isTwetch ? (
                      <p>
                        <span className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap font-bold  text-gray-900 hover:underline dark:text-white">
                          {userName}
                        </span>
                        <span className="text-sm font-semibold hover:underline text-gray-400 dark:text-gray-600 ml-1">
                          {paymail}
                        </span>
                      </p>
                    ) : (
                      <p className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap font-bold text-gray-900 hover:underline dark:text-white">
                        {paymail}
                      </p>
                    )}
                  </Link>
                )}
              </div>
              <div className="grow" />
              <a
                onClick={(e: any) => e.stopPropagation()}
                target="_blank"
                rel="noreferrer"
                href={`https://whatsonchain.com/tx/${content_txid}`}
                className="whitespace-nowrap text-xs leading-5 text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:dark:text-gray-500"
                id={`_${content_txid}`}
              >
                {moment(timestamp * 1000).fromNow()}
              </a>
              {/* tooltip */}
              <Tooltip
                anchorSelect={`#_${content_txid}`}
                style={{ width: "fit-content", borderRadius: "4px" }}
                place="right"
                className="italic text-white dark:bg-gray-100 dark:text-black"
                clickable
              >
                <a
                  href="https://learnmeabitcoin.com/technical/txid"
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e: any) => e.stopPropagation()}
                >
                  What is a txid?
                </a>
              </Tooltip>
            </div>
            {contentText && (
              <article
                onClick={(e: any) => e.stopPropagation()}
                className="prose break-words dark:prose-invert prose-a:text-primary-600 dark:prose-a:text-pirmary-400"
              >
                <Markdown
                  options={RemarkableOptions}
                  source={contentText.replace(
                    BFILE_REGEX,
                    "https://dogefiles.twetch.app/$1"
                  )}
                />
              </article>
            )}
            {postMedia.length > 0 && (
              <div
                className="grid grid-gap-0.5 gap-0.5 mt-2 rounded-xl select-none overflow-hidden"
                style={{
                  gridTemplateColumns: `repeat(${
                    postMedia.length > 1 ? "2" : "1"
                  }, 1fr)`,
                }}
              >
                {postMedia.map((media: any, index: number) => (
                  <div
                    id={`media_${content_txid}_${index.toString()}`}
                    className="relative rounded-xl overflow-hidden"
                  >
                    <div className="h-full">
                      {isTwetch ? (
                        <img
                          src={`https://dogefiles.twetch.app/${media}`}
                          className="rounded-xl h-full w-full grid object-cover"
                        />
                      ) : (
                        <img
                          src={`data:image/jpeg;base64,${media}`}
                          className="rounded-xl h-full w-full grid object-cover"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!hlsVideoUrl && linkUnfurls.map((linkUnfurl: any) => (
              <a
                onClick={(e:any) => e.stopPropagation()}
                href={linkUnfurl.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 rounded-xl bg-primary-100 dark:bg-primary-900/20 relative flex flex-col"
              >
                <img
                  src={linkUnfurl.image}
                  className="rounded-t-xl max-w-full object-cover "
                />
                <div
                  className={`bg-primary-300 dark:bg-primary-700 py-3 px-4 ${
                    linkUnfurl.image ? "rounded-b-xl" : "rounded-xl"
                  }`}
                >
                  <div className="h-[46px] flex flex-col justify-center">
                    <p className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                      {linkUnfurl.description}
                    </p>
                    <p className="text-xs mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
                      {linkUnfurl.url}
                    </p>
                  </div>
                </div>
              </a>
            ))}
            {jig && <NFTJig jig={jig} />}
            {playerURLs.length > 0 &&
              playerURLs.map((url: string, index: number) => (
                <ReactPlayer
                  key={`${content_txid}_player_index`}
                  controls={true}
                  url={url}
                  style={{ maxWidth: "100%" }}
                />
              ))}
            {tweetId.length > 0 && <TwitterTweetEmbed tweetId={tweetId} />}
            {hlsVideoUrl && ( 
              <div style={{'flexDirection': 'column', display: 'flex'}} className='flex items-center mt-10 hls-video-container'>
                <ReactPlayer width={'100%'} height={'100%'} controls={true}  url={hlsVideoUrl} />
              </div>  
            )}
          </div>
        </div>
        <div
          className={`col-span-12 flex ${
            isTwetch && "justify-between"
          }  w-full px-16`}
        >
          {isTwetch ? (
            <LoveOrdButton txid={content_txid} userPaymail={paymail} />
          ) : (
            <div className="grow" />
          )}
          <div className="group relative flex w-fit min-w-[111px] items-center justify-center">
            <svg
              viewBox="0 0 40 40"
              fill="none"
              className="h-[40px] w-[40px] fill-gray-500 group-hover:fill-green-500 dark:fill-gray-300"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.7698 26.04L16.7796 26.0214C16.8013 25.98 16.8245 25.9351 16.8491 25.8873C17.03 25.5371 17.2911 25.0314 17.6274 24.6275C18.0608 24.1068 18.7281 23.6137 19.6907 23.6137C22.7525 23.6137 24.8033 23.173 26.0492 22.4503C27.1805 21.794 27.7035 20.8819 27.7035 19.5258C27.7035 16.3261 24.3811 13.2965 19.6907 13.2965C15.2771 13.2965 12.2965 16.1275 12.2965 19.5258C12.2965 20.3629 12.6319 22.2529 13.4911 23.5026L13.4978 23.5125L13.4978 23.5125C14.3586 24.7897 15.3301 25.7902 16.4883 26.5864C16.5026 26.5622 16.5179 26.5356 16.5341 26.5064C16.6042 26.3801 16.6748 26.2365 16.7606 26.059L16.7698 26.04ZM17.9278 26.6233C17.9537 26.574 17.9795 26.5244 18.0053 26.4748C18.4108 25.6944 18.8183 24.9101 19.6907 24.9101C25.9691 24.9101 29 23.1358 29 19.5258C29 15.3652 24.8247 12 19.6907 12C14.7423 12 11 15.2428 11 19.5258C11 20.5354 11.3711 22.7075 12.4227 24.2371C13.4124 25.7055 14.5567 26.8681 15.9485 27.7858C16.1649 27.9388 16.3814 28 16.5979 28C17.2474 28 17.5876 27.327 17.9278 26.6233Z"
              />
            </svg>
            <p className="text-gray-500 group-hover:text-green-500 dark:text-gray-300">
              {commentCount}
            </p>
          </div>
          <div className="boost-button-info-text" data-tooltip-offset={20}>
            <BoostButton
              content={content_txid}
              difficulty={computedDiff || 0}
              existingTags={existingTags}
              defaultTag={defaultTag}
            />
          </div>
          <Tooltip
            anchorSelect=".boost-button-info-text"
            place="right"
            className="text-white text-sm dark:bg-gray-100 dark:text-black top-4"
            style={{
              width: "fit-content",
              borderRadius: "4px",
              backgroundColor: "#333",
            }}
          >
            <p>Boost to a higher rank!</p>
          </Tooltip>
        </div>
        <div className="col-span-12 flex w-full flex-wrap overflow-hidden px-4 pb-4">
          {tags?.map((tag: any, index: number) => {
            if (
              tag.hex !== "0000000000000000000000000000000000000000" &&
              tag.utf8.length > 0
            ) {
              return (
                <Link
                  key={`tag_${content_txid}_${index}`}
                  onClick={(e: any) => e.stopPropagation()}
                  href={`/topics/${tag.utf8}`}
                >
                  <div className="mr-2 mt-2 flex items-center rounded-full bg-primary-500 p-2 text-sm font-bold text-white">
                    {tag.utf8}{" "}
                    <span className="ml-2">
                      ⛏️ {Math.round(tag.difficulty)}
                    </span>
                  </div>
                </Link>
              );
            }
          })}
        </div>
      </div>
    </>
  );
};

const handleBoostLoading = () => {
  toast("Publishing Your Boost Job to the Network", {
    icon: "⛏️",
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    },
  });
};

const handleBoostSuccess = () => {
  toast("Success!", {
    icon: "✅",
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    },
  });
};

const handleBoostError = () => {
  toast("Error!", {
    icon: "🐛",
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    },
  });
};

export default BoostContentCardV2;
