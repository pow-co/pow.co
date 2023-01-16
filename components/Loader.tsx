import React, { useEffect, useState} from 'react'

const loadingEmoji = ["🧠", "⛏️", "🦚", "🦌"]

const Loader = () => {
  const [emoji, setEmoji] = useState("")

  useEffect(() => {
    setEmoji(loadingEmoji[Math.floor(Math.random()*loadingEmoji.length)])
  },[])

  return (
    <div className='grid grid-cols-12 h-screen ' >
        <div className='col-span-12 mx-auto text-4xl animate-pulse'>
        {emoji}
        </div>
    </div>
  )
}

export default Loader