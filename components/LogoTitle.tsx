import React from 'react';
import { useTheme } from "next-themes";
import { config } from '../template_config';
import Stag from './Stag';

const LogoTitle = () => {
  const { theme } = useTheme();

  return (
<div className="flex items-center justify-center">
  {/* {theme === "light" ? <img className='w-[180px]' src="/icons/askbitcoin_logo_without_margins_or_background.png" /> : <img className='w-[180px]' src="/icons/askbitcoin_logo_inverted_without_margins_or_background.png"/>} */}
  <Stag size={46} theme={theme || "light"} />
  
    <span className="ml-4 hidden text-center text-3xl font-bold sm:block">{config.appname}</span>
</div>
);
};

export default LogoTitle;
