import React, { useEffect, useMemo, useState } from "react";
import ThreeColumnLayout from "../../components/ThreeColumnLayout";


import useWallet from "../../hooks/useWallet";
import { useRouter } from "next/router";

import { Meeting } from "../../src/contracts/meeting";
import artifact from "../../artifacts/meeting.json";

Meeting.loadArtifact(artifact);


interface SoundcloudTrack {
  Title: string;
  Description: string;
  Tags: string;
  TrackUrl: string;
  Username: string;
  UserProfileUrl: string;
  ImageUrl: string;
  EmbedCode: string;
  CreatedAt: string;
  TrackId: string;
  UserId: string;
}

const SoundcloudTrackCard = ({ track }: { track: SoundcloudTrack }) => {

  const [isPlaying, setIsPlaying] = useState(false);

  const [buttonState, setButtonState] = useState<'initial' | 'confirm' | 'success'>('initial');

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handleButtonClick = () => {
    if (buttonState === 'initial') {
      setButtonState('confirm');
    } else if (buttonState === 'confirm') {
      fundMp3Download();
    }
  };

  const fundMp3Download = () => {
    setTimeout(() => {
      // Logic to download the mp3 file goes here
      downloadMp3();

      // Update button state to success
      setButtonState('success');
    }, 1000);
  };



  const downloadMp3 = () => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        // Simulate downloading an empty MP3
        const blob = new Blob([], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = titleToMp3(track.Title);
        a.click();
        resolve();
      }, 1000);
    });
  };


  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">

      <>
      {isPlaying ? (
      <div dangerouslySetInnerHTML={{ __html: track.EmbedCode }} />
    ) : (
        <div className="md:flex">
          <div className="md:flex-shrink-0 relative">
          <div className="relative md:flex-shrink-0">
            <img 
              className="h-48 w-full object-cover md:w-48" 
              src="https://i1.sndcdn.com/artworks-wWqWMSAmM2zjk00z-2eO4lg-t500x500.jpg" 
              alt="Soundcloud track artwork" 
            />
            {!isPlaying && 
              <button 
                className="absolute inset-0 flex items-center justify-center"
                onClick={handlePlayClick}
              >
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="80" height="80" rx="15" fill="black" fillOpacity="0.6"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M30 20L60 40L30 60V20Z" fill="white"/>
                </svg>
              </button>
            }
          </div>
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {track.Username} <span className="text-gray-500">on</span> {track.CreatedAt}
            </div>
            <a
              href={track.TrackUrl}
              className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
            >
              {track.Title}
            </a>
            <p className="mt-2 text-gray-500">
              {track.Description || 'No description provided.'}
            </p>
          </div>
        </div>
            )}

        <div className="flex justify-between px-6 py-4">
          <button 
              onClick={handleButtonClick} 
              style={{ 
                backgroundColor: buttonState === 'success' ? 'green' : buttonState === 'confirm' ? 'blue' : 'grey',
                transition: 'background-color 0.3s ease-in-out'
              }}
              className="text-white rounded px-4 py-2"
            >
              {buttonState === 'initial' && 'Download MP3'}
              {buttonState === 'confirm' && 'Pay 100,000 sats?'}
              {buttonState === 'success' && 'Success ✓'}
          </button>
          <button className="bg-green-500 text-white rounded px-4 py-2">Boost</button>
          <button className="bg-yellow-500 text-white rounded px-4 py-2">Save to Library</button>
        </div>
      </>
  </div>
  )

}

const SoundcloudTrackPage = () => {

  const wallet = useWallet();

  const router = useRouter();

  const [track, setTrack] = useState<SoundcloudTrack | null>(null);

  useEffect(() => {

    const dummyTrack: SoundcloudTrack = {
      "Title": "Odyssey - Together ( Dave Allison Remix)  Unreleased]",
      "Description": "",
      "Tags": " ",
      "TrackUrl": "https://soundcloud.com/dave-allison/odyssey-together-dave-allison-remix-unreleased",
      "Username": "Dave Allison",
      "UserProfileUrl": "https://soundcloud.com/dave-allison",
      "ImageUrl": "https://i1.sndcdn.com/artworks-wWqWMSAmM2zjk00z-2eO4lg-t500x500.jpg",
      "EmbedCode": "<iframe width=\"100%\" height=\"400\" scrolling=\"no\" frameborder=\"no\" src=\"https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1581431327&show_artwork=true\"></iframe>",
      "CreatedAt": "August 03, 2023 at 05:28AM",
      "TrackId": "1581431327",
      "UserId": "34566"
    }

    setTrack(dummyTrack);

  }, []);

  if (!track) return <></>

  return (
      <ThreeColumnLayout>

        <SoundcloudTrackCard track={track} />

      </ThreeColumnLayout>
  );
};

const titleToMp3 = (title: string): string => {
  // Replace special characters and spaces with hyphens
  const formattedTitle = title.trim().replace(/[^a-zA-Z0-9]/g, "_");
  
  // Concatenate with .mp3 extension
  return `${formattedTitle}.mp3`;
};

export default SoundcloudTrackPage;
