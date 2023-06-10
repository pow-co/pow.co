import React from 'react'
import { useTheme } from "next-themes"
import { config } from '../template_config'
import { useSubdomain } from '../hooks/subdomain'
const LogoTitle = () => {
  const { theme} = useTheme()

  const { subdomain, settings } = useSubdomain()
  return <>
  {/* {theme === "light" ? <img className='w-[180px]' src="/icons/askbitcoin_logo_without_margins_or_background.png" /> : <img className='w-[180px]' src="/icons/askbitcoin_logo_inverted_without_margins_or_background.png"/>} */}

  {subdomain ? (
	  <span className='text-3xl font-bold text-center'>{subdomain}</span>
  ) : (
	  <span className='text-3xl font-bold text-center'>{config.appname}</span>
  )}
  </>
}

export default LogoTitle
