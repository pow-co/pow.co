import React from 'react'

interface PersonalInterestsProps {
  onClose: () => void
}

const PersonalInterestsPopup = ({ onClose }: PersonalInterestsProps) => {

  const SAMPLE_TOPIC = ["business", "art", "health", "politics", "sports", "bitcoin", "family", "music", "technology"]

  return (
    <div className='fixed inset-0'>
      <div className='flex flex-col h-screen'>
        <div onClick={onClose} className='grow'/>
        <div className='flex'>
          <div onClick={onClose} className='grow'/>
          <div className='flex flex-col justify-center max-w-lg p-10 sm:rounded-lg bg-primary-100 dark:bg-primary-900'>
            <h1 className='text-2xl font-bold text-center'>What are you interested in?</h1>
            <h2 className='text-lg italic text-center text-gray-600 dark:text-gray-400'>Create a dedicated feed that matches your topics of interest</h2>
            <div className='justify-around flex flex-wrap p-3 gap-2'>
              {SAMPLE_TOPIC.map((topic: string) => (
                <div className='cursor-pointer rounded-full border px-5 py-2 hover:bg-primary-500 hover:border-none'>{topic}</div>
              ))}
            </div>
            <button 
                className='mt-5 mx-auto text-sm leading-4 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-blue-400 to-blue-500 cursor-pointer items-center text-center justify-center py-2 px-5 transition duration-500 transform hover:-translate-y-1'
            >
                Pick Interests
            </button>
            <div>
            </div>
          </div>
          <div onClick={onClose} className='grow'/>
        </div>
        <div onClick={onClose} className='grow'/>
      </div>

    </div>
  )
}

export default PersonalInterestsPopup