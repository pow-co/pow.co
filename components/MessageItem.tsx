import { toast } from "react-hot-toast";
import Link from "next/link";
import UserIcon from "./UserIcon";
import PostDescription from "./PostDescription";
import { BoostButton } from "myboostpow-lib";
import { useBitcoin } from "../context/BitcoinContext";
import moment from "moment";
import { useTheme } from "next-themes";

export const MessageItem = (props:any) => {
    const { wallet } = useBitcoin()
    const theme = useTheme()

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
        <Link className='col-span-2 sm:col-span-1 flex justify-center' href={`/profile/${props.MAP.paymail}`}>
          <div className='cursor-pointer'>
            <UserIcon src={`https://a.relayx.com/u/${props.MAP.paymail}`} size={36}/>
          </div>
        </Link>
        <div className='col-span-10 sm:col-span-11 flex flex-col justify-center w-full'>
          <div className='flex justify-between pr-5'>
            <Link href={`/profile/${props.MAP.paymail}`}>
              <p className='cursor-pointer text-lg text-blue-600 font-semibold hover:underline'>{props.MAP.paymail}</p>
            </Link>
            <a href={`https://whatsonchain.com/tx/${props.tx.h}`} target="_blank" rel="noreferrer">
              <span className='text-xs text-gray-500 font-semibold'>{moment(props.timestamp * 1000).fromNow()}</span>
            </a>
          </div>
          <PostDescription bContent={props.B.content}/>
        </div>
        <div className='hidden col-span-12 group-hover:grid grid-col-12 justify-end'>
          <div className='col-span-11'/>
          <div className='col-span-1'>
            <BoostButton
              wallet={wallet}
              content={props.tx.h}
              difficulty={0}
              //@ts-ignore
              theme={theme.theme}
              showDifficulty={false}
              onSending={handleBoostLoading}
              onError={handleBoostError}
              onSuccess={handleBoostSuccess}
            />
          </div>
        </div>
      </div>
    )
}