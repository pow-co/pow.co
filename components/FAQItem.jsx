import React from 'react'

const FAQItem = ( {title, tldr, content }) => {
  return (
    <div className="grid grid-cols-12 bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 mt-1 first:sm:rounded-t-lg last:sm:rounded-b-lg">
        <div className='col-span-12 mb- p-4 max-w-screen cursor-pointer text-gray-900 dark:text-white'>
            <h3 className='text-xl font-semibold'>{title}</h3>
            <p className='mt-2 font-light'>{tldr}</p>
            <p>{content}</p>
        </div>
    </div>
    )
}

export default FAQItem