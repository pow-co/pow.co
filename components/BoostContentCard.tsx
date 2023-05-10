import moment from 'moment';
import { BoostButton } from 'boostpow-button';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FormattedMessage } from 'react-intl';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import Linkify from 'linkify-react';
import { Tooltip } from 'react-tooltip';
import axios from 'axios';
import Gist from 'super-react-gist';
import UserIcon from './UserIcon';
import OnchainEvent from './OnChainEvent';
import { useTuning } from '../context/TuningContext';
import Twetch from './Twetch';
import RelayClub from './RelayClub';
import PostMedia from './PostMedia';

import { useBitcoin } from '../context/BitcoinContext';
import { BASE } from '../hooks/useAPI';

const Markdown = require('react-remarkable');

const RemarkableOptions = {
  breaks: true,
  html: true,
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

export interface Ranking {
  content_txid: string;
  content_text?: string;
  content_type?:string;
  count?: number;
  difficulty?: number;
  createdAt?: Date;
  rank?: number;
}

export const queryBMAP = (txid: string) => ({
  v: 3,
  q: {
    find: {
      'tx.h': txid,
    },
    project: {
      out: 0,
      in: 0,
    },
  },
});

function BoostContentCard({
  content_txid, content_text, difficulty, rank, 
}: Ranking) {
  const [isTwetch, setIsTwetch] = useState(false);
  const [isClub, setIsClub] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const { wallet } = useBitcoin();
  const [commentCount, setCommentCount] = useState(0);
  const [inReplyTo, setInReplyTo] = useState('');
  const [paymail, setPaymail] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [computedDiff, setComputedDiff] = useState<number>(difficulty || 0);
  const { filter } = useTuning();

  const filterLabel = useMemo(() => {
    switch (filter) {
      case 'last-hour':
        return <FormattedMessage id="Last Hour" />;
      case 'last-day':
        return <FormattedMessage id="Last Day" />;
      case 'last-week':
        return <FormattedMessage id="Last Week" />;
      case 'last-month':
        return <FormattedMessage id="Last Month" />;
      case 'last-year':
        return <FormattedMessage id="Last Year" />;
      default:
        return <FormattedMessage id="All" />;
    }
  }, [filter]);

  const [loading, setLoading] = useState<boolean>(true);

  const [content, setContent] = useState<any>(null);
  const [tags, setTags] = useState<any>([]);
  const [timestamp, setTimestamp] = useState(0);
  const [ordinal, setOrdinal] = useState<any>();

  const gradient = 'from-pink-400 to-violet-600';

  const getData = async () => {
    // const [content, bmapContent, bmapComments, tagsResult] = await Promise.all([
    const [contentResult, powcoCommentsResult] = await Promise.all([
      axios.get(`${BASE}/content/${content_txid}`)
        .catch((err) => {
          console.error('api.content.fetch.error', err);
          return { data: { content: {} } };
        }),
      axios.get(`${BASE}/content/${content_txid}/replies`).catch((err) => {
        console.error('api.replies.fetch.error', err);
        return { data : { replies: [] } };
      }),
    ]);

    const { content } = contentResult.data;
    const { tags } = contentResult.data;
    const powcoComments = powcoCommentsResult.data.replies || [];

    return {
      content, tags,  powcoComments
    };
  };

  useEffect(() => {
    getData().then((res) => {
      console.log(res)
      setContent(res.content);
      setInReplyTo(res.content.context_txid || '')
      setTags(res.tags);
      if (!difficulty) {
        setComputedDiff(res.tags.reduce((acc: number, curr: any) => acc + curr.difficulty, 0));
      }
      /* if (res.bmapContent?.MAP[0].type === 'reply' && res.bmapContent?.MAP[0].context === 'tx') {
        setInReplyTo(res.bmapContent.MAP[0].tx);
      } */
      if (res.content.createdAt) {
        setTimestamp(moment(res.content.createdAt).unix());
      }
      setPaymail(res.content.map?.paymail);
      switch (true) {
        case res.content.map?.paymail?.includes('relayx'):
          setAvatar(`https://a.relayx.com/u/${res.content.map?.paymail}`);
          break;
        case res.content.map?.paymail?.includes('twetch'):
          setAvatar(`https://auth.twetch.app/api/v2/users/${res.content.map?.paymail.split('@')[0]}/icon`);
          break;
        case res.content.map?.paymail?.includes('handcash'):
          setAvatar(`https://cloud.handcash.io/v2/users/profilePicture/${res.content.map?.paymail.split('@')[0]}`);
          break;
        default:
          setAvatar('');
      }
      setCommentCount(res.powcoComments.length);
      setLoading(false);
      if (res.content.bmap?.ORD) {
        setOrdinal(res.content.bmap.ORD[0])
      }
    });
    /* axios.get(`${BASE}/content/${content_txid}`).then(({data}) => {
            setContent(data.content)
            setLoading(false)
        })
        .catch((err) => {
            console.error('api.content.fetch.error', err)
        }) */
  }, []);

  const handleBoostLoading = () => {
    toast('Publishing Your Boost Job to the Network', {
      icon: '⛏️',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const handleBoostSuccess = () => {
    toast('Success!', {
      icon: '✅',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const handleBoostError = () => {
    toast('Error!', {
      icon: '🐛',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  /* if (content) {

        content_text = content?.content_text || content_text

        content_type = content?.content_type || content_type
      } */

  if (loading || !content) {
    return (
            <div className="mt-0.5 grid grid-cols-12 bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 first:md:rounded-t-lg last:md:rounded-b-lg">
            <div className="max-w-screen mb-0.5 grid cursor-pointer grid-cols-12 items-start px-4 pb-1 pt-4" />
            </div>
    );
  }
  function PostContent() {
    if (content?.content_text?.startsWith('https://gist.github.com/')) {
      return (
<>
              <small className=""><a href={content?.content_text} target="_blank" className="blankLink" rel="noreferrer">{content?.content_text}</a></small>
                <div className="text-ellipsis ">
                    <Gist url={content?.content_text} />
                </div>
</>
      );
    }

    return (
            <>
            {ordinal && (
              <img src={`data:image/jpeg;base64,${ordinal?.data}`} className="h-full w-full rounded-lg" />
            )}
            {content.content_type?.match('image') && (
              content.content_text ? <img src={`data:image/jpeg;base64,${content.content_text}`} className="h-full w-full rounded-lg" /> : <PostMedia files={[content.txid]} />
            )}
            {content.content_type?.match('text/plain') && (
                <div className="mt-1 whitespace-pre-line break-words text-base leading-6 text-gray-900 dark:text-white"><Linkify options={{ target: '_blank', className: 'linkify-hover text-blue-500 hover:underline' }}>{content_text}</Linkify></div>
            )}
            {content.content_type?.match('markdown') && (
                <article className="prose break-words dark:prose-invert prose-a:text-blue-600">
                    <Markdown options={RemarkableOptions} source={content.content_text!.replace(BFILE_REGEX, 'https://dogefiles.twetch.app/$1')} />
                </article>
            )}
            <OnchainEvent txid={content.txid} />
            </>
    );
  }

  const navigate = (e: any) => {
    e.stopPropagation();
    router.push(`/${content_txid}`);
  };

  if (!content) {
    return (
            <div onClick={navigate} className="mt-0.5 grid grid-cols-12 bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 first:md:rounded-t-lg last:md:rounded-b-lg">
                <div className="max-w-screen mb-0.5 grid cursor-pointer grid-cols-12 items-start px-4 pb-1 pt-4" />
            </div>
    );
  }

  // console.log('CONTENT.MAP', content.map)

  return (
    <div onClick={navigate} className="mt-0.5 grid grid-cols-12 bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 first:md:rounded-t-lg last:md:rounded-b-lg">
      <div className="col-span-12 px-4 pt-4">
        <p className="text-2xl font-semibold ">
          <span className={`bg-gradient-to-br bg-clip-text text-transparent ${gradient}`}>
          {computedDiff.toFixed(4)}
          </span> 
          <span className="ml-1">⛏️</span>
        </p>
      </div>
        {inReplyTo.length > 0 && router.pathname === '/' && <p className="col-span-12 overflow-hidden text-ellipsis px-4 pt-3 text-sm italic text-gray-600 dark:text-gray-400">in reply to <span className="text-xs text-primary-500 hover:underline"><Link href={`/${inReplyTo}`}>{inReplyTo}</Link></span></p>}
        <Twetch setIsTwetch={setIsTwetch} txid={content.txid} difficulty={difficulty || 0} tags={tags} />
        <RelayClub setIsClub={setIsClub} txid={content.txid} difficulty={difficulty || 0} tags={tags} />
        {!(isTwetch || isClub) && (
<div className="col-span-12">
            <div className="max-w-screen mb-0.5 grid cursor-pointer grid-cols-12 items-start px-4 pt-4">
                <div className="col-span-1 flex h-full w-full flex-col justify-center">
                    {paymail && (
<Link className="justify-start" onClick={(e:any) => e.stopPropagation()} href={`/profile/${paymail}`}>
                        <UserIcon src={avatar} size={46} />
</Link>
                    )}
                      <div className="grow" />
                      {rank && <p className="text-center"><span className={`${rank < 4 ? 'font-semibold' : 'italic'}`}>#{rank}</span> {filterLabel}</p>}
                      <div className="grow" />
                </div>
                <div className="col-span-11 ml-6">
                       <div className="flex">
                            {paymail && (
                            <Link
                              href={`/profile/${paymail}`}
                              onClick={(e:any) => e.stopPropagation()}
                              className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold leading-4 text-gray-900 hover:underline dark:text-white"
                            >
                                {paymail}
                            </Link>
                            )}
                            <div className="grow" />

                            <a
                              onClick={(e:any) => e.stopPropagation()}
                              target="_blank"
                              rel="noreferrer"
                              href={`https://whatsonchain.com/tx/${content.txid}`}
                              className="whitespace-nowrap text-xs leading-5 text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:dark:text-gray-500"
                              id={`_${content.txid}`}
                            >
                                {moment(timestamp * 1000).fromNow()}
                            </a>
                            {/* tooltip */}
                            <Tooltip
                              anchorSelect={`#_${content.txid}`}
                              style={{ width: 'fit-content', borderRadius: '10px' }}
                              place="right"
                              className="italic text-white dark:bg-gray-100 dark:text-black"
                              clickable

                            >
                                <a
                                  href="https://learnmeabitcoin.com/technical/txid"
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e:any) => e.stopPropagation()}
                                >
                                    What is a txid?
                                </a>
                                {/* <span>{content_txid}</span> */}
                            </Tooltip>
                       </div>
                    <PostContent />
                    <div className="flex w-full px-16">
                        <div className="grow" />
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
                          wallet={wallet}
                          content={content_txid}
                          difficulty={computedDiff || 0}
                            // @ts-ignore
                          theme={theme.theme}
                          showDifficulty
                          onSending={handleBoostLoading}
                          onError={handleBoostError}
                          onSuccess={handleBoostSuccess}
                        />
                        </div>
                        <Tooltip
                          anchorSelect=".boost-button-info-text"
                          place="right"
                          className="italic text-white dark:bg-gray-100 dark:text-black"
                            // content="Boost this post to the top \nof the rankings!"
                          style={{ width: 'fit-content', borderRadius: '10px' }}
                        >   
                            <p>
                                Boost this post to the top <br />of the rankings!
                            </p>
                        </Tooltip>
                    </div>
                </div>
            </div>
        <div className="flex w-full flex-wrap overflow-hidden px-4 pb-4">
            {tags?.map((tag:any, index: number) => {
              if (tag.utf8.length > 0) {
                return (
                        <Link key={`tag_${content_txid}_${index}`} onClick={(e:any) => e.stopPropagation()} href={`/topics/${tag.utf8}`}>
                            <div className="mr-2 mt-2 flex items-center rounded-full bg-primary-500 p-2 text-sm font-bold text-white">{tag.utf8} <span className="ml-2">⛏️ {Math.round(tag.difficulty)}</span></div>
                        </Link>
                );
              }
            })}
        </div>
</div>
        )}
    </div>
  );
}

export default BoostContentCard;
