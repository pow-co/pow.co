import React from 'react'
import { useTheme } from "next-themes"
import { config } from '../template_config'
import { useSubdomain } from '../hooks/subdomain'
import Stag from './Stag'
const LogoTitle = () => {
  const { theme } = useTheme()

  const { subdomain, settings } = useSubdomain()
  return <div className='flex items-center'>
  {/* {theme === "light" ? <img className='w-[180px]' src="/icons/askbitcoin_logo_without_margins_or_background.png" /> : <img className='w-[180px]' src="/icons/askbitcoin_logo_inverted_without_margins_or_background.png"/>} */}
  <Stag size={46} theme={theme || "light"}/>
  {subdomain ? (
	  <span className='hidden sm:block ml-4 text-3xl font-bold text-center'>{subdomain}</span>
  ) : (
	  <span className='hidden sm:block ml-4 text-3xl font-bold text-center'>{config.appname}</span>
  )}
  </div>
}

export default LogoTitle
