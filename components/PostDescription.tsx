import React, { useState } from 'react'

import Linkify from "linkify-react";

const PostDescription = ({ bContent }) => {
    const [ description, setDescription ] = useState(bContent)
  return (
    <div className='mt-1 text-gray-900 dark:text-white text-base leading-6 whitespace-pre-line break-words'><Linkify options={{target: '_blank' , className: 'linkify-hover'}}>{description}</Linkify></div>
  )
}

export default PostDescription