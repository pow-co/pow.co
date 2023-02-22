import React, { useEffect} from 'react'

interface UserIconProps {
    size: number;
    src: string;
}

const UserIcon = (props: UserIconProps) => {
  return (
    <div 
        className={`h-10 w-10 flex rounded-full items-center justify-center bg-gray-700`}
        style={{height:`${props.size}px`, width:`${props.size}px`, minHeight:`${props.size}px`, minWidth:`${props.size}px`}}>
        <div className='flex items-center justify-center'>
            <div className='flex rounded-full items-center justify-center'>
                <span 
                    className={`h-9 w-9 box-border inline-block overflow-hidden bg-none opacity-100 border-none m-0 p-0 relative`}>
                    <img 
                        src={props.src} 
                        className='absolute rounded-full inset-0 box-border p-0 border-none m-auto block w-0 h-0 min-w-full max-w-full min-h-full max-h-full object-cover object-center'
                    />
                </span>
            </div>
        </div>
    </div>
  )
}

export default UserIcon