import { useRouter } from 'next/navigation'
import React from 'react'
import useWallet from '../../../hooks/useWallet'
import { useLocalWallet } from '../../../context/LocalWalletContext'
import { useAPI } from '../../../hooks/useAPI'
import ThreeColumnLayout from '../../../components/v13_ThreeColumnLayout'
import { Meeting, getMeeting } from '../../../services/meetings'
import EventDetailCard from '../../../components/v13_EventDetail'
import PanelLayout from '../../../components/v13_PanelLayout'
import { Metadata, ResolvingMetadata } from 'next'

type Props = {
    params: { txid: string }
    //searchParams: { [key: string]: string | string[] | undefined }
  }

async function getEventData(origin: string): Promise<Meeting | null> {
    const eventData = await getMeeting({txid:origin})
    return eventData || null
}

export async function generateMetadata({params}: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const txid = params.txid

    const meeting = await getMeeting({txid})

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    return {
        title: meeting?.title,
        description: meeting?.description,
        openGraph: {
            title: meeting?.title,
            description: meeting?.description,
            url:"https://pow.co",
            siteName: 'PoW.co',
            images: [{
                url:meeting?.cover! || "https://dogefiles.twetch.app/793eaf19c59f24a20c3671024f5d3f4b4892e8b06f5b8973038a5a7e9505b02d",
                width: 1200,
                height: 600
            }, ...previousImages],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            title: meeting?.title,
            description: meeting?.description,
            images: [meeting?.cover! || "https://dogefiles.twetch.app/793eaf19c59f24a20c3671024f5d3f4b4892e8b06f5b8973038a5a7e9505b02d", ...previousImages]
        }
    }
}



const EventDetailPage = async ({
  params: { txid },
}: {
  params: { txid: string }
}) => {
  const eventData = await getEventData(txid)


  return (
      <PanelLayout>
            {eventData && <EventDetailCard meeting={eventData!}/>}
      </PanelLayout>
  );
};

export default EventDetailPage;