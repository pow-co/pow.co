import Link from 'next/link'
import React from 'react'
import { format } from "timeago.js";

import { UserIcon } from '.'


const MessageCard = (props) => {
  return (
    <div className='mt-2 px-4 w-full max-w-screen flex truncate'>
        <UserIcon src={`https://bitpic.network/u/${props.user}`} size={46}/>
        <div className='max-w-[calc(100% - 52px)] w-full flex flex-col ml-3'>
            <div className='flex items-baseline'>
                <Link href={`/u/${props.user.split("@")[0]}`} >
                    <span className='cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis text-blue-500 dark:text-blue-400 font-bold mr-2'>
                        {`1${props.user.split("@")[0]}`}
                    </span>
                </Link>
                <a target="_blank" rel="noreferrer" href={`https://whatsonchain.com/tx/${props.tx_id}`} className='text-xs leading-5 whitespace-nowrap text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:dark:text-gray-500'>
                {format(new Date(props.timestamp * 1000))}
                </a>
            </div>
            <div className='mt-1 text-base break-words whitespace-pre-line'>
                {props.content}
            </div>
            <div className=''></div>
        </div>
    </div>
  )
}

export default MessageCard