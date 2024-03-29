import { toast } from "react-hot-toast";
import Link from "next/link";
import UserIcon from "./UserIcon";
import PostDescription from "./PostDescription";
import BoostButton  from './BoostpowButton/BoostButton';
import { useBitcoin } from "../context/BitcoinContext";
import moment from "moment";
import { useTheme } from "next-themes";
import { useEffect, useMemo } from "react";
import Linkify from "linkify-react";

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

export const MessageItem = (props:any, isSide: boolean) => {
  const { wallet } = useBitcoin()
  const { bmap, createdAt } = props
  const theme = useTheme()
  
  const avatar = useMemo(() => {
    switch (true) {
      case bmap.MAP[0]?.paymail?.includes("relayx"):
        return `https://a.relayx.com/u/${bmap.MAP[0].paymail}`;
        case bmap.MAP[0]?.paymail?.includes("twetch"):
          return `https://auth.twetch.app/api/v2/users/${bmap.MAP[0].paymail.split("@")[0]}/icon`
          case bmap.MAP[0]?.paymail?.includes("handcash"):
            return `https://cloud.handcash.io/v2/users/profilePicture/${bmap.MAP[0].paymail.split("@")[0]}`
            default:
              return "https://a.relayx.com/u/0";
            }
          }, [bmap.MAP[0]?.paymail]);
          
  if(!bmap.MAP || !bmap.B){
    return <></>
  }
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
    return (
      <div className='group grid grid-cols-12 bg-primary-300 dark:bg-primary-700/20 py-4 cursor-pointer hover:bg-primary-200 hover:dark:bg-primary-800/20'>
        <Link className={"col-span-2 sm:col-span-1 flex justify-center"} href={`/profile/${bmap.MAP[0].paymail}`}>
          <div className='cursor-pointer'>
            <UserIcon src={avatar} size={36}/>
          </div>
        </Link>
        <div className="col-span-10 px-2 sm:col-span-11 flex flex-col justify-center w-full -mb-10">
          <div className='flex justify-between pr-5'>
            <Link href={`/profile/${bmap.MAP[0].paymail}`}>
              <p className='truncate cursor-pointer text-lg text-primary-600 dark:text-primary-400 font-semibold hover:underline'>{bmap.MAP[0].paymail}</p>
            </Link>
            <a href={`https://whatsonchain.com/tx/${bmap.tx.h}`} target="_blank" rel="noreferrer">
              <span className='text-xs text-gray-500 font-semibold'>{moment(createdAt).fromNow()}</span>
            </a>
          </div>
          <article className='mt-1 whitespace-pre-line break-words prose dark:prose-invert prose-a:text-primary-600 dark:prose-a:text-pirmary-400'>
            <Markdown options={RemarkableOptions} source={bmap.B[0].content}/>
          </article>
        </div>
        <div className='hidden col-span-12 group-hover:grid grid-col-12 justify-end'>
          <div className='col-span-11'/>
          <div className='col-span-1'>
            <BoostButton
              content={bmap.tx.h}
              difficulty={0}
              showDifficulty={false}
            />
          </div>
        </div>
      </div>
    )
}
