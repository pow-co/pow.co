import React from 'react'
import { useEffect } from 'react'
import { useTuning } from '../context/TuningContext'

import { FormattedMessage } from 'react-intl';

interface TuningPanelProps {
  closeAction?: () => void
}

const TuningPanel = ({ closeAction }: TuningPanelProps) => {
    const { filter, setFilter, zenMode, setZenMode } = useTuning()

    const handleChange = (e:any) => {
      setFilter(e.target.value);
      if (closeAction){

        closeAction()     
      }
      
    }
    const toggleZen = () => {
      setZenMode(!zenMode)
      if (closeAction){

        closeAction()     
      }
    }
  return (
    <div className='flex flex-col'>
      <div className='flex items-center w-full'>
          <label htmlFor="filter" className="text-sm font-medium text-gray-700 dark:text-gray-200"><FormattedMessage id="filter"/>:</label>
          <select value={filter} onChange={handleChange} id="filter" className="ml-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block grow p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="last-hour"><FormattedMessage id="Last Hour"/></option>
            <option value="last-day"><FormattedMessage id="Last Day"/></option>
            <option value="last-week"><FormattedMessage id="Last Week"/></option>
            <option value="last-month"><FormattedMessage id="Last Month"/></option>
            <option value="last-year"><FormattedMessage id="Last Year"/></option>
            <option value="all-time"><FormattedMessage id="All"/></option>
          </select>
      </div>
      <div className='py-5 flex items-center w-full cursor-pointer'>
          <label htmlFor="zenMode" className="text-sm font-medium text-gray-700 dark:text-gray-200"><FormattedMessage id="Zen Mode"/>:</label>
          <div className="relative ml-5">
          <label className="inline-flex relative items-center cursor-pointer">
          <input type="checkbox" onChange={toggleZen} 
           checked={zenMode} className="sr-only peer"/>
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
      </div>
    </div>
  )
}

export default TuningPanel
