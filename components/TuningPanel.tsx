import React from 'react'
import { useEffect } from 'react'
import { useTuning } from '../context/TuningContext'

import { FormattedMessage } from 'react-intl';

interface TuningPanelProps {
  closeAction?: () => void
}

const TuningPanel = ({ closeAction }: TuningPanelProps) => {
    const { filter, setFilter} = useTuning()

    const handleChange = (e:any) => {
      setFilter(e.target.value);
      if (closeAction){

        closeAction()     
      }
      
    }
    
  return (
    <div className='flex flex-col'>
      <div className='flex items-center w-full'>
          <label htmlFor="filter" className="text-sm font-medium text-gray-700 dark:text-gray-200"><FormattedMessage id="filter"/>:</label>
          <select value={filter} onChange={handleChange} id="filter" className="ml-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-primary-500 focus:border-primary-500 block grow p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
            <option value="last-hour"><FormattedMessage id="Last Hour"/></option>
            <option value="last-day"><FormattedMessage id="Last Day"/></option>
            <option value="last-week"><FormattedMessage id="Last Week"/></option>
            <option value="last-month"><FormattedMessage id="Last Month"/></option>
            <option value="last-year"><FormattedMessage id="Last Year"/></option>
            <option value="all-time"><FormattedMessage id="All"/></option>
          </select>
      </div>
    </div>
  )
}

export default TuningPanel
