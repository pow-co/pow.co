import { useRouter } from 'next/router'
import React from 'react'
import Dropzone from '../../components/Dropzone'
import FileInput from '../../components/FileInput'
import ThreeColumnLayout from '../../components/ThreeColumnLayout'

const ComposeImage = () => {
    const router = useRouter()
  return (
    <ThreeColumnLayout>
      <div className="col-span-12 lg:col-span-6 min-h-screen">
        <svg
          onClick={() => router.back()}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="relative top-[69px] -left-[42px] w-6 h-6 stroke-gray-700 dark:stroke-gray-300 cursor-pointer hover:opacity-70"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        <div className="mt-3 lg:mt-8 mb-[200px] lg:rounded-xl bg-primary-100 dark:bg-primary-700/20 pt-4 pb-3">
            {/* <FileInput/> */}
            <Dropzone/>
        </div>
      </div>
    </ThreeColumnLayout>
  )
}

export default ComposeImage