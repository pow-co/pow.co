import React from 'react'
import UserIcon from './UserIcon';

export interface UserProfileCardProps {
    banner?: string;
    avatar: string;
    userName: string;
    paymail: string;
    description?: string;
    url?: string;

}

const UserProfileCard = (props: UserProfileCardProps) => {
    console.log(props)
    const { banner, avatar, userName, paymail, description, url } = props
  return (
    <div className=''>
        <div className="h-48 bg-primary-100 dark:bg-primary-600/20 w-full relative cursor-pointer overflow-hidden sm:rounded-t-xl">
            <span className="box-border block overflow-hiden bg-none opacity-100 border-none m-0 p-0 absolute inset-0">
            <img
                src={banner}
                decoding="async"
                className="h-32 bg-primary-100 dark:bg-primary-600/20 sm:rounded-t-xl relative cursor-pointer overflow-hidden  inset-0 box-border p-0 border-none m-auto block w-0 min-h-full max-h-full min-w-full max-w-full object-cover object-center"
            />
            </span>
        </div>
        <div className="flex flex-col relative sm:rounded-b-xl px-8 pb-8 bg-primary-200 dark:bg-primary-600/20">
            <div className="flex flex-row justify-center">
                <div className="-mt-8 mb-1.5 bg-primary-100 dark:bg-primary-600/20 h-16 w-16 rounded-full cursor-pointer">
                    <div 
                        className={`h-10 w-10 flex rounded-full items-center justify-center dark:bg-primary-700/20 bg-primary-200`}
                        style={{height:`64px`, width:`64px`, minHeight:`64px`, minWidth:`64px`}}>
                        <div className='flex items-center justify-center'>
                            <div className='flex rounded-full items-center justify-center'>
                                <span 
                                    className={`h-14 w-14 box-border inline-block overflow-hidden bg-none opacity-100 border-none m-0 p-0 relative`}>
                                    <img 
                                        src={avatar} 
                                        className='absolute rounded-full inset-0 box-border p-0 border-none m-auto block w-0 h-0 min-w-full max-w-full min-h-full max-h-full object-cover object-center'
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {userName}
                </p>
                {paymail && <p
                className="text-gray-700 dark:text-gray-300 text-base inline-block"
                >
                {paymail}
                </p>}
                {description && (
                <p className="text-base text-center leading-5 text-gray-900 dark:text-white mt-4 mb-3">
                    {description}
                </p>
                )}
                {url && (
                <div className="mt-1.5 flex items-center">
                    <svg
                    viewBox="0 0 16 18"
                    fill="none"
                    className="fill-gray-500 dark:fill-gray-300 opacity-50 w-4 h-3"
                    >
                        <path d="M7.90569 12.108L8.90911 11.0895C7.91324 11.014 7.26441 10.7122 6.77402 10.2218C5.45373 8.90156 5.46128 7.03053 6.76647 5.72533L9.22598 3.26582C10.5463 1.95308 12.4022 1.94553 13.7225 3.26582C15.0428 4.58611 15.0277 6.4496 13.7225 7.7548L12.2438 9.23352C12.455 9.71637 12.5003 10.2747 12.4248 10.7651L14.6429 8.55452C16.4461 6.74384 16.4612 4.18625 14.6354 2.35294C12.8021 0.519624 10.2369 0.534713 8.42626 2.34539L5.85359 4.92561C4.04291 6.73629 4.02782 9.30142 5.86113 11.1272C6.33644 11.6025 6.94 11.942 7.90569 12.108ZM8.09431 5.89131L7.09089 6.90981C8.08676 6.9928 8.73559 7.28704 9.22598 7.77743C10.5463 9.09772 10.5387 10.9688 9.23353 12.274L6.76647 14.7335C5.45373 16.0462 3.59778 16.0537 2.2775 14.741C0.95721 13.4132 0.964754 11.5572 2.2775 10.2445L3.75622 8.76576C3.54497 8.29046 3.49216 7.72462 3.57515 7.23423L1.35707 9.44477C-0.446067 11.2554 -0.461156 13.8206 1.36461 15.6463C3.19793 17.4797 5.76306 17.4646 7.56619 15.6614L10.1464 13.0737C11.9571 11.263 11.9722 8.69786 10.1389 6.87209C9.66356 6.39679 9.06 6.05729 8.09431 5.89131Z"></path>
                    </svg>
                    <a
                    target="_blank"
                    rel="noreferrer"
                    href={url}
                    className="mx-1 text-ellipsis overflow-hidden text-blue-500 inline-block text-base font-normal leading-5	tracking-normal	 text-left hover:underline"
                    >
                    {url}
                    </a>
                </div>
                )}            
            </div>
        </div>
    </div>
  )
}

export default UserProfileCard