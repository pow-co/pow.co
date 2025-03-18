import { useState, useEffect } from 'react';

interface ChannelSettings {
 header_logo_url?: string;
 banner_image_url?: string;
 name?: string;
 channel?: string;
 meet_token_origin?: string;
 live_token_origin?: string;
}

interface Settings {
 [channel: string]: ChannelSettings;
}

const allSettings: Settings = {
 bethebroadcast: {
  header_logo_url: 'https://bethebroadcast.club/images/Be+The+Broadcast+Logo+White-01.png',
 },
 spacedisco: {
  header_logo_url: 'https://i1.sndcdn.com/avatars-FpI7waRL4lhRDZi3-n1jgWA-t500x500.jpg',
 },
 geist: {},
 scrypt: {
 },
 'peafowl-excellence': {},
};

export function useSubdomain() {
 const [settings, setSettings] = useState<ChannelSettings>({});
 const subdomain = null;

 useEffect(() => {
  if (subdomain && allSettings[subdomain]) {
   setSettings(allSettings[subdomain]);
  }
 }, [subdomain]);

 return { subdomain, settings };
}
