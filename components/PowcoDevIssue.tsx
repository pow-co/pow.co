
import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { useState } from 'react';
import useSWR from 'swr';

const linkPreviewEnabled = true

const customFetcher = async (url: string) => {
    const response = await fetch(`https://link-preview-proxy.pow.co/v2?url=${url}`);
    const json = await response.json();
    return json.metadata;
};  

export default function PowcoDevIssue({ event }: {event: any}) {
    

    if (linkPreviewEnabled) { 
            
        return <LinkPreview url={event.content.html_url} fetcher={customFetcher} fallback={<div>  
            <small><a href='{event.content.html_url}' className='blankLink'>{event.content.html_url}</a></small>
            <h3>{event.content.title}</h3>
            <h4>{event.content.body}</h4>
        </div>} />

    } else {

        return <>
            <small><a href='{event.content.html_url}' className='blankLink'>{event.content.html_url}</a></small>
            <h3>{event.content.title}</h3>
            <h4>{event.content.body}</h4>
        </>

    }

}