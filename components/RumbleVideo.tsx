

export default function RumbleVideo({ videoId, url }: { videoId: string, url: string }) {

  console.log('insert rumble video', {videoId})

  return(
    <>
      <iframe style={{width: '100%', minHeight: '200px'}} src={`https://rumble.com/embed/${videoId}/`}></iframe>
      <h2>{url}</h2>
    </>
  )
}

