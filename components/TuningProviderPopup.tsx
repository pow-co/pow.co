import React, { useContext, useState } from 'react'
import { useRelay } from '../context/RelayContext';
import TuningPanel from './TuningPanel';

interface TuningProviderProps {
  onClose: () => void
}
const TuningProviderPopUp = ({ onClose }: TuningProviderProps) => {


  return (
    <div className="fixed inset-0 ">
      <div className="flex flex-col h-screen">
        <div
          onClick={onClose}
          className="grow cursor-pointer"
        />
        <div className="flex ">
          <div
            onClick={onClose}
            className="grow cursor-pointer"
          />
          <div className="flex-col max-w-sm w-[310px] p-5 rounded-lg bg-primary-100 dark:bg-primary-800">
            <div className='py-3 '>
              <p className="text-xl text-center font-bold text-gray-800 dark:text-gray-200">
                Tuning Panel
              </p>
              <p className="text-center italic text-gray-700 dark:text-gray-300 text-sm mt-1 mb-4">
              🌊 setting up the vibes 🌊 
              </p>
            </div>
            <TuningPanel closeAction={onClose}/>
          </div>
          <div
            onClick={onClose}
            className="grow cursor-pointer"
          />
        </div>
        <div
          onClick={onClose}
          className="grow cursor-pointer"
        />
      </div>
    </div>
  )
}

export default TuningProviderPopUp