import YouTube from 'react-youtube';

export function YoutubeMetadataOnchain({event}: {txid: string, event: any}) {

    const opts = {
      //height: '390',
      width: '100%',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
      },
    };
  
    return (
      <>
  
        <YouTube videoId={event.content.video_id} opts={opts}/>
      </>
    )
  
  }
  