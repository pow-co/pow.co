
import { useState, useEffect } from 'react'

interface ChannelSettings {
	header_logo_url?: string;
	banner_image_url?: string;
	name?: string;
	channel?: string;
	meet_token_origin?: string;
	live_token_origin?: string;
}

interface TokenMeetVideo {
  channel: string;
  title: string;
  hls_url?: string;
  thumbnail_image_url?: string;
  hls_audio_url?: string;
  mp4_url?: string;
  token_origin?: string;
  transcription?: string;
}

interface Settings {
	[channel: string]: ChannelSettings;
}

const allSettings: Settings = {
  'bethebroadcast': {
	  header_logo_url: 'https://bethebroadcast.club/images/Be+The+Broadcast+Logo+White-01.png'
  },
  'spacedisco': {
	  header_logo_url: 'https://i1.sndcdn.com/avatars-FpI7waRL4lhRDZi3-n1jgWA-t500x500.jpg'
  },
  'geist': {},
  'scrypt': {
  },
  'peafowl-excellence': {}
}

type Channel = string

interface Domains {
	[domain: string]: Channel;
}

const domains: Domains = {
  'peafowlexcellence.com': 'peafowl-excellence',
  'spacedisco.com': 'spacedisco',
  'geist.live': 'geist',
  'bethebroadcast.club': 'bethebroadcast',
  'scrypt.live': 'scrypt'
}

export function useSubdomain(position = 0) {

  const [settings, setSettings] = useState<ChannelSettings>({})

  const [subdomain] = useState<string | null | undefined>(() => {
    try {

      let hostname = window?.location?.hostname
      //let hostname = "peafowlexcellence.com"
      if (domains[hostname]) {
        return domains[hostname]
      }
      
      let subdomain = window?.
      location?.
      hostname?.
      split('.')[position];
      
      if (window?.location?.hostname?.split('.').length == 2) { return null }

      if(subdomain === "localhost"){ return null}
      if(subdomain === "next"){ return null}

      return subdomain

    } catch (err) {
      console.error(err);
    }
  });

  useEffect(() => {
      console.log("the subdomain is",subdomain)
      if (subdomain && allSettings[subdomain]) {

	      setSettings(allSettings[subdomain])

      }

  }, [subdomain])

  useEffect(() => {

	  console.log('settings', settings)

  }, [settings])

  return {subdomain, settings};
}
