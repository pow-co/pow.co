import React from 'react'
import { UserIcon, PostDescription, PostMedia } from '.'
import Link from 'next/link'



const Placeholder = () => {
  const meIcon="https://img.rarecandy.io/cdn-cgi/image/width=200,quality=100/https://dogefiles.twetch.app/4ad21cc303b979c8e570e9c09bc639dc28c14928fb56aef8659db6dd5a50baaf"
  const placeholderText = `
Hello frens, welcome to Cozy Homes!
We did a litlle rebranding as you can see...

"There will be a Twetch interface for literally everything."
This is what drove me into learning how to program and start building on BitCoin two years ago.

*This* is still an experimental product, but it is the first of its kind. 
You are in the local feed. It shows all Twetch posts made through this specific site. 
You can see the global Twetch feed in the global tab.

Cozy Homes takes 10% of the Twetch cut for each interaction made through its apps. 
We are going to sell new kinds of NFTs that grant the same type of royalty for the NFT holder 🔥. 

I am still working on making Twetch interactions work at the moment, so no posting no liking.

If you want to help me or want we to help you, please head to the Cosy Homes Market to see how. 

Thanks for being *here*! 😌
Get cozy and have fun exploring !

`;
  const post = {userId:"652",userByUserId : {icon:meIcon, name:"Guillaume ✪"}, bContent: placeholderText }
  return (
    <div  className='grid grid-cols-12 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 hover:dark:bg-gray-500 mt-0.5 first:rounded-t-lg'>
      <div className='col-span-12'>
        <div className='mb-0.5 px-4 pt-4 pb-1 grid items-start grid-cols-12 max-w-screen cursor-pointer'>
          <div className='col-span-1'>
            <Link  href={`/u/${post.userId}`}>
              <a onClick={(e)=>e.stopPropagation()}>
                <UserIcon src={post.userByUserId.icon} size={46}/>
              </a>
            </Link>
          </div>
          <div className='col-span-11 ml-6'>
            <div className='flex'>
              <Link  href={`/u/${post.userId}`}>
                <div onClick={(e)=>e.stopPropagation()} className='text-base leading-4 font-bold text-gray-900 dark:text-white cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis	hover:underline'>
                  {post.userByUserId.name}<span className='ml-1 font-normal text-gray-500 dark:text-gray-300'>@{post.userId}</span>
                </div>
              </Link>
              <div className='grow'/>
              
              <div className='flex items-center ml-4 h-5 w-5 text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:dark:text-gray-500'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
            </div>
            <PostDescription bContent={post.bContent}/>
            {/* <PostMedia files={JSON.parse(post.files)}/> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Placeholder