import React from 'react'

const PostMedia = ({files}) => {
    if(!files){
        return null
    }
  return (
    <div className='relative mt-3 grid grid-cols-2 gap-1 rounded-lg overflow-hidden h-full w-full'>
        
            {files.map((file, index)=>(
                <div key={file} className={`relative ${files.length === 1 ? 'col-span-2': 'col-span-1'}`} >
                        <img 
                            src={`https://dogefiles.twetch.app/${file}`} 
                            decoding="async" 
                            data-nimg="fill" 
                            className='rounded-lg ' 
                        />
                </div>
            ))}
        
    </div>
  )
}

export default PostMedia