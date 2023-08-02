import React, { useState } from "react";

import bops from "bops";
import { bsv } from 'scrypt-ts'
import axios from "axios";
import moment from "moment";

import Wallet from '../wallets/abstract'

import useWallet from '../hooks/useWallet'

const B_PREFIX = `19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut`;
export const MAP_PREFIX = `1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5`;

interface ChatComposerProps {
  channel: string;
  onNewMessageSent: (message: any) => void;
  onChatImported?: (message: any) => void;
}

class BitchatClient {
  wallet: Wallet;
  app: string;

  constructor({ app, wallet }: { app: string, wallet: Wallet }) {
    this.app = app
    this.wallet = wallet
  }

  buildMessageScript({ content, channel }: { content: string, channel: string }): bsv.Script {

    let dataPayload = [
      B_PREFIX, // B Prefix
      content,
      "text/plain",
      "utf-8",
      "|",
      MAP_PREFIX, // MAP Prefix
      "SET",
      "app",
      this.app,
      "type",
      "message",
      "paymail",
      this.wallet.paymail,
      "context",
      "channel",
      "channel",
      channel
    ];

    const script = bsv.Script.fromASM(
      "OP_0 OP_RETURN " +
        dataPayload
          .map((str) => bops.to(bops.from(str, "utf8"), "hex"))
          .join(" ")
    );

    return script

  }

  async sendMessage({ content, channel }: {content: string, channel:string }): Promise<bsv.Transaction> {

    const script = this.buildMessageScript({ content, channel })

    const tx: bsv.Transaction = await this.wallet.createTransaction({

      outputs: [new bsv.Transaction.Output({
        script,
        satoshis: 10
      })]

    })

    axios.post('https://pow.co/api/v1/posts', {
      transactions: [{
        tx: tx.toString()
      }]
    })
    .then(console.log)
    .catch(console.error)

    axios.post("https://b.map.sv/ingest", {
      rawTx: tx.toString(),
    })
    .catch(console.error)

    axios.get(`https://pow.co/api/v1/chat/messages/${tx.hash}`).catch(console.error);

    return tx

  }

}

const ChatComposer = ({
  channel,
  onNewMessageSent,
  onChatImported,
}: ChatComposerProps) => {

  const [inputValue, setInputValue] = useState("");

  const [sending, setSending] = useState(false);

  const [rows, setRows] = useState(1);

  const wallet = useWallet()

  const handleSubmit = async () => {

    if (!wallet.paymail) {
      alert("Please, connect your wallet");
      return;
    }

    const content = inputValue;

    if (content !== "" && wallet.paymail) {

      setInputValue("");

      setSending(true);
      
      let client = new BitchatClient({ app: 'pow.co', wallet })

      let pendingMsg = {
        bmap:{
          B: [
            {
              content,
              "content-type": "text/plain",
              encoding: "utf-8",
            },
          ],
          MAP: [
            {
              channel,
              paymail: wallet.paymail,
            },
          ],
          tx: {
            h: "pending",
          }
        },
        createdAt:moment()
      };

      onNewMessageSent(pendingMsg);

      await client.sendMessage({ content, channel })

      setSending(false)

      if (onChatImported) {
        console.log({ pendingMsg })
        onChatImported(pendingMsg);
      }

    }
  };

  // TODO: Detect whether the user is typing
  const handleKeyDown = (event: any) => {
    let ctrlDown = false;
    let ctrlKey = 17;
    let cmdKey = 91;
    let vKey = 86;
    let cKey = 67;
    const enterKey = 13;

    if (event.keyCode === ctrlKey || event.keyCode === cmdKey) ctrlDown = true;

    if (ctrlDown && event.keyCode === cKey) console.log("Document catch Ctrl+C");
    if (ctrlDown && event.keyCode === vKey) console.log("Document catch Ctrl+V");

    if (event.keyCode === enterKey && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleKeyUp = (event: any) => {
    const enterKey = 13;
    let ctrlDown = false;
    let ctrlKey = 17;
    let cmdKey = 91;
    let vKey = 86;
    let cKey = 67;

    setRows(event.target.value.split("\n").length);

    if (event.keyCode === ctrlKey || event.keyCode === cmdKey) ctrlDown = false;

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

  const handleChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setInputValue((event.target as HTMLTextAreaElement).value);
  };

  return (
    <div className="w-full items-center border-t-0 dark:border-white/20 bg-white dark:bg-gray-800 !bg-transparent py-2">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-3xl"
      >
        <div className="relative flex h-full flex-1 md:flex-col">
          <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
            <textarea
              name="msg_content"
              value={inputValue}
              rows={rows}
              onChange={handleChange}
              autoComplete="off"
              className="m-0 w-full appearance-none resize-none border-0 bg-transparent p-0  focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
              style={{ height: rows > 1 ? "48px" : "24px", maxHeight: "48px" }}
              placeholder={`${
                sending ? "Sending..." : `Message in ${channel} chat`
              }`}
              onKeyUp={handleKeyUp}
              onKeyDown={handleKeyDown}
            />
            <button type="submit" className="hidden" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatComposer;

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
