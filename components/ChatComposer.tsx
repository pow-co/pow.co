import React, { useState } from "react";

import nimble from "@runonbitcoin/nimble";
//import { BAP } from "bitcoin-bap";
import bops from "bops";
import bsv from "bsv";
//import Buffer from "Buffer";
import { last } from "lodash";
//import { useBap } from "../../context/bap";
//import { useHandcash } from "../../context/handcash";
import { useRelay } from "../context/RelayContext";
import { useBitcoin } from "../context/BitcoinContext";
import { useRouter } from "next/router";
import axios from "axios";
import TwetchWeb3 from "@twetch/web3";
import moment from "moment";
//import { useActiveChannel } from "../../hooks";
//import ChannelTextArea from "./ChannelTextArea";
//import InvisibleSubmitButton from "./InvisibleSubmitButton";

interface ChatComposerProps {
  channelId: string;
  onNewMessageSent: (message: any) => void
}
const ChatComposer = ({ channelId, onNewMessageSent }: ChatComposerProps) => {
  //const dispatch = useDispatch();
  // const user = useSelector((state) => state.session.user);
  const { relayOne } = useRelay();
  const { paymail, wallet } = useBitcoin()
  const [inputValue, setInputValue] = useState("")
  const [sending, setSending] = useState(false)
  const [rows, setRows] = useState(1)
  

  //const { profile, authToken, hcDecrypt } = useHandcash();
  //const { identity } = useBap();

  //const activeChannel = useActiveChannel();
  let timeout = undefined;

  const handleSubmit = async () => {
      if (!paymail){
        alert("Please, connect your wallet")
          return
      }
      const content = inputValue

      if (content !== "" && paymail) {
        setInputValue("")
        setSending(true)
        await sendMessage(
          paymail!,
          content,
          channelId //activeChannel?.channel || channelId || null
        ).then(()=>setSending(false));
      }
  }

  const sendMessage = 
    async (pm: string, content: string, channel:string) => {
        let dataPayload = [
          B_PREFIX, // B Prefix
          content,
          "text/plain",
          "utf-8",
          "|",
          MAP_PREFIX, // MAP Prefix
          "SET",
          "app",
          "chat.pow.co",
          "type",
          "message",
          "paymail",
          pm,
        ];

        // add channel
        if (channel) {
          dataPayload.push("context", "channel", "channel", channel);
        }

        const script = nimble.Script.fromASM(
          "OP_0 OP_RETURN " +
            dataPayload
              .map((str) => bops.to(bops.from(str, "utf8"), "hex"))
              .join(" ")
        );
        let outputs
        let futureBMAP = {
          B:[{
            content:content,
            "content-type":"text/plain",
            encoding: "utf-8"
          }],
          MAP: [{
            channel: channel,
            paymail: paymail
          }],
          timestamp:moment().unix(),
          tx:{
            h: "pending"
          }
        }
        onNewMessageSent(futureBMAP)
        switch (wallet){
          case "relayx":
            outputs = [{ script: script.toASM(), amount: 0, currency: "BSV" }];
            let { rawTx, txid } = await relayOne!.send({ outputs });

            console.log("Sent", txid);
            await axios.post('https://b.map.sv/ingest', {
                rawTx: rawTx
            });
            
            break;
          case "twetch":
            outputs = [{
              sats:0,
              script: script.toASM(),
              address: null
            }]
            const resp = await TwetchWeb3.abi({
              contract: "payment",
              outputs: outputs
            })
            await axios.post('https://b.map.sv/ingest', {
              rawTx: resp.rawtx
            })
            break;
          case "handcash":
            break;
          default:
            console.log("no wallet selected")
        }
        
        
    }

  //const typingUser = useSelector((state) => state.chat.typingUser);

  // TODO: Detect whether the user is typing
  const handleKeyDown = (event: any) => {
    let ctrlDown = false;
    let ctrlKey = 17;
    let cmdKey = 91;
    let vKey = 86;
    let cKey = 67;
    const enterKey = 13;

    if (event.keyCode == ctrlKey || event.keyCode == cmdKey) ctrlDown = true;

    if (ctrlDown && event.keyCode == cKey) console.log("Document catch Ctrl+C");
    if (ctrlDown && event.keyCode == vKey) console.log("Document catch Ctrl+V");

    if (event.keyCode == enterKey && !event.shiftKey){
      event.preventDefault()
      handleSubmit()
    }
  };

  const handleKeyUp = (event: any) => {
    const enterKey = 13;
    let ctrlDown = false;
    let ctrlKey = 17;
    let cmdKey = 91;
    let vKey = 86;
    let cKey = 67;

    setRows(event.target.value.split("\n").length)

    if (event.keyCode == ctrlKey || event.keyCode == cmdKey) ctrlDown = false;

    if (event.keyCode === enterKey) {
      //console.log("enter");
      // dispatch(stopTyping(paymail));
    } else if (event.keyCode === vKey && event.keycode === ctrlKey) {
      //console.log("hey hey heeeyyyyy");
    } else {
      //console.log("other");
      // dispatch(typing(paymail));
      // clearTimeout(timeout);
      // timeout = setTimeout(() => dispatch(stopTyping(paymail)), 2000);
    }
  };

  const handleChange = (e:any) => {
    e.preventDefault()
    setInputValue(e.target.value)
  }

  return (
    <div className="w-full items-center border-t-0 dark:border-white/20 bg-white dark:bg-gray-800 !bg-transparent py-2">
      <form onSubmit={handleSubmit} autoComplete="off" className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-3xl">
        <div className="relative flex h-full flex-1 md:flex-col">
          <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
            <textarea
              name="msg_content"
              value={inputValue}
              rows={rows}
              onChange={handleChange}
              autoComplete="off"
              className="m-0 w-full appearance-none resize-none border-0 bg-transparent p-0  focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
              style={{height:rows > 1 ? "48px": "24px", maxHeight:"48px"}}
              placeholder={`${sending ? "Sending..." : `Message in ${channelId} chat`}`}
              onKeyUp={handleKeyUp}
              onKeyDown={handleKeyDown}
            />
            <button type="submit" className="hidden"/>
            </div>
          </div>
      </form>
      {/* <div>
        {typingUser && `${typingUser.paymail} is typing...`}
      </div> */}
    </div>
  );
};

export default ChatComposer;

const B_PREFIX = `19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut`;
const AIP_PREFIX = `15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva`;
export const MAP_PREFIX = `1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5`;

// /**
//  * Sign an op_return hex array with AIP
//  * @param opReturn {array}
//  * @param signingPath {string}
//  * @param outputType {string}
//  * @return {[]}
//  */
// const signOpReturnWithAIP = (
//   opReturn,
//   currentPath,
//   pk,
//   signingPath = "",
//   outputType = "hex"
// ) => {
//   const aipMessageBuffer = getAIPMessageBuffer(opReturn);

//   const { address, signature } = signMessage(
//     aipMessageBuffer,
//     currentPath,
//     pk,
//     signingPath
//   );

//   return opReturn.concat([
//     bops.to(bops.from("|", "utf8"), outputType),
//     bops.to(bops.from(AIP_PREFIX, "utf8"), outputType),
//     bops.to(bops.from("BITCOIN_ECDSA", "utf8"), outputType),
//     bops.to(bops.from(address, "utf8"), outputType),
//     bops.to(bops.from(signature, "base64"), outputType),
//   ]);
// };

// /**
//  * Construct an AIP buffer from the op return data
//  * @param opReturn
//  * @returns {Buffer}
//  */
// const getAIPMessageBuffer = (opReturn) => {
//   const buffers = [];
//   if (opReturn[0].replace("0x", "") !== "6a") {
//     // include OP_RETURN in constructing the signature buffer
//     buffers.push(bops.from("6a", "hex"));
//   }
//   opReturn.forEach((op) => {
//     buffers.push(bops.from(op.replace("0x", ""), "hex"));
//   });
//   // add a trailing "|" - this is the AIP way
//   buffers.push(bops.from("|"));

//   return bops.join([...buffers]);
// };

// /**
//  * Sign a message with the current signing address of this identity
//  *
//  * @param message
//  * @param signingPath
//  * @returns {{address, signature}}
//  */
// const signMessage = (message, currentPath, pk, signingPath = "") => {
//   // if (!(message instanceof Buffer)) {
//   //   message = bops.from(message, "");
//   // }

//   signingPath = signingPath || currentPath;
//   const derivedChild = pk.deriveChild(signingPath);
//   const address = derivedChild.privateKey.publicKey.toAddress().toString();

//   console.log({ address, derivedChild });
//   const bsvMsg = new bsv.Message(message);
//   console.log({ bsvMsg });
//   var hash = bsvMsg.magicHash();
//   // return ECDSA.signWithCalcI(hash, privateKey);
//   const signature = bsv.ECDSA.signWithCalcI(hash, derivedChild.privateKey);

//   // const signature = bsv.Message(message).sign(derivedChild.privateKey);

//   return { address, signature };
// };

// var sha256sha256 = bsv.crypto.Hash.sha256sha256;

// const magicHash = () => {
//   var prefix1 = bsv.util.BufferWriter.varintBufNum(
//     bsv.Message.MAGIC_BYTES.length
//   );
//   var prefix2 = bsv.util.BufferWriter.varintBufNum(
//     bsv.Message.messageBuffer.length
//   );
//   var buf = bops.join([
//     prefix1,
//     bsv.Message.MAGIC_BYTES,
//     prefix2,
//     bsv.Message.messageBuffer,
//   ]);
//   var hash = sha256sha256(buf);
//   return hash;
// };