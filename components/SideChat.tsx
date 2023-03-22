import { useRef, useState, useEffect } from "react";
import useSWR from "swr";
import { MessageItem } from "./MessageItem";
import ChatComposer from "./ChatComposer";

interface SideChatProps {
    room: string;
}

export const SideChat = ({room}: SideChatProps) => {
    const socketRef = useRef<EventSource | null>(null);
    const composerRef = useRef(null)
    const [newMessages, setNewMessages] = useState<any>([])
    const [pending, setPending] = useState<any>()
    const { data, error, isLoading } = useSWR(`https://b.map.sv/q/${messageQuery(false, room, "", "")}`, fetcher)
    const messages = data?.c || []

    useEffect(() => {
        setNewMessages([])
    },[data])

    useEffect(() => {
        setNewMessages([])
    // create a new WebSocket connection
    socketRef.current = new EventSource(`https://b.map.sv/s/${messageQuery(false, room, "", "")}`);

    // add event listeners for the WebSocket connection
    socketRef.current.addEventListener("open", () => {
      console.log("WebSocket connection opened");
    });

    socketRef.current.addEventListener("message", (event: any) => {
      const message = JSON.parse(event.data);
      if(message.type === "push"){
        let newMessage = message.data[0]
        console.log("New Message: ",newMessage)
        setPending({})
        setNewMessages((prevMessages: any) => [newMessage, ...prevMessages])
      }
    });

    socketRef.current.addEventListener("close", () => {
      console.log("WebSocket connection closed");
    });

    return () => {
      // close the WebSocket connection when the component unmounts
      socketRef.current?.close();
    };
    },[room])
    return (
        <>
            <div className='overflow-y-auto overflow-x-hidden relative flex flex-col-reverse' style={{height: "calc(100vh - 218px)"}} >
            {pending && <div className='opacity-60'><MessageItem {...pending}/></div>}
                {newMessages?.map((message: any) => {
                return <MessageItem key={message.tx.h} {...message}/>
                })}
                {messages?.map((message: any) => {
                return <MessageItem key={message.tx.h} {...message}/>
                })}
            </div>
            <div ref={composerRef} className='p-4'>
                <ChatComposer channelId={room!} onNewMessageSent={(newMessage:any) => setPending(newMessage)}/>
            </div>
        </>
    )
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const messageQuery = (verboseMode: boolean, channelId?: string, userId?: string, myId?: string) => {
  // console.log("query with", userId, channelId);
  let q = {
    v: 3,
    q: {
      find: {
        "MAP.type": verboseMode ? { $in: ["post", "message"] } : "message",
      },
      sort: {
        timestamp: -1,
        "blk.t": -1,
      },
      limit: 100,
    },
  };
  if (channelId) {
    //@ts-ignore
    q.q.find["MAP.channel"] = channelId;
  } else if (userId && myId) {
    //@ts-ignore
    q.q.find["$or"] = [
      { $and: [{ "MAP.bapID": myId }, { "AIP.bapId": userId }] },
      { $and: [{ "AIP.bapId": myId }, { "MAP.bapID": userId }] },
    ];
    // stuff added by indexer uses camelCase
    // stuff in the protocol uses caps ID
    //TODO: q.q.find["MAP.encrypted"] = true;
  } else {
    //@ts-ignore
    q.q.find["$and"] = [
      { "MAP.context": { $exists: false } },
      { "MAP.channel": { $exists: false } },
    ];
  }
  return btoa(JSON.stringify(q));
};