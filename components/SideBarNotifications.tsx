import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRelay } from '../context/RelayContext'
import { NotificationCard, Loader } from '.';
import { getNotificationsFeed } from '../services';

const SideBarNotifications = () => {
  const { authenticated } = useRelay()
  const [loggedIn, setLoggedIn] = useState(false)


  useEffect(()=>{
    setLoggedIn(authenticated)
} ,[authenticated])

  const notifications = []

  const refetch = () => {
    console.log(refetch)
  }

  if(!loggedIn){
    return null
  } else {
  return (
    <div className='bg-gray-100 dark:bg-gray-600 rounded-lg min-h-60'>
      <div className='flex items-center p-4'>
        <p className='text-lg font-bold text-gray-900 dark:text-white'>Notifications</p>
        <svg onClick={refetch} viewBox="0 0 16 16" fill="none" className="h-4 w-4 cursor-pointer ml-3 fill-gray-600 dark:fill-gray-300 hover:fill-gray-700 hover:dark:fill-gray-500">
          <path d="M-3.49691e-07 8C-5.40993e-07 12.3765 3.62353 16 8 16C12.3686 16 16 12.3686 16 7.99216C16 3.62353 12.3686 -1.58732e-07 8 -3.49691e-07C3.62353 -5.40993e-07 -1.58732e-07 3.63137 -3.49691e-07 8ZM7.63137 4.38431C9.61569 4.38431 11.1686 6.01569 11.1686 7.83529C11.1686 7.90588 11.1608 7.99216 11.1529 8.0549L11.7333 7.4902C11.8275 7.40392 11.9686 7.34118 12.1098 7.34118C12.4 7.34118 12.6275 7.56078 12.6275 7.85882C12.6275 8 12.5647 8.14118 12.4627 8.22745L10.8863 9.78039C10.6824 9.96863 10.3294 9.98431 10.1333 9.78039L8.56471 8.21176C8.47843 8.12549 8.40784 7.99216 8.40784 7.85882C8.40784 7.56863 8.63529 7.34118 8.92549 7.34118C9.06667 7.34118 9.2 7.40392 9.29412 7.49804L10.0706 8.28235C10.0863 8.20392 10.0941 8.09412 10.0941 7.99216C10.0941 6.61176 8.98039 5.50588 7.6 5.50588C6.21177 5.50588 5.09804 6.61176 5.09804 7.99216C5.09804 9.37255 6.21176 10.4784 7.6 10.4784C7.90588 10.4784 8.15686 10.7373 8.15686 11.0431C8.15686 11.3412 7.90588 11.6 7.6 11.6C5.60784 11.6 3.98431 9.99216 3.98431 7.99216C3.98431 5.99216 5.60784 4.38431 7.63137 4.38431Z"></path>
        </svg>
        <div className='grow'/>
        <Link href="/notifications">
          <p className='cursor-pointer text-blue-500 text-sm hover:underline'>See all</p>
        </Link>
      </div>
      <div className='flex flex-col px-2'>
        {notifications.map((notification, index)=>(
          <NotificationCard key={index} {...notification}/>
        ))}
      </div>
    </div>
  )}
}

export default SideBarNotifications