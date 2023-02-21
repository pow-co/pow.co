import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRelay } from '../context/RelayContext'
import { useTuning } from '../context/TuningContext';
import TuningPanel from './TuningPanel';

import { FormattedMessage } from 'react-intl';

const SidebarTuning = () => {
  
  return (
    <div className='bg-primary-100 dark:bg-primary-600/20 rounded-lg min-h-60'>
      <div className='flex items-center p-4'>
        <p className='text-lg font-bold text-gray-900 dark:text-white'><FormattedMessage id="Tuning Panel"/></p>
      </div>
      <div className='flex flex-col px-4 pb-10 '>
        <TuningPanel/>
      </div>
    </div>
  )
}

export default SidebarTuning