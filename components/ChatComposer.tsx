import React, { useState } from "react";

import bops from "bops";
import { bsv } from 'scrypt-ts';
import axios from "axios";
import moment from "moment";

import Wallet from '../wallets/abstract';

import useWallet from '../hooks/useWallet';
import Drawer from "./Drawer";
import WalletProviderPopUp from "./WalletProviderPopUp";
import { useBitcoin } from "../context/BitcoinContext";

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
    this.app = app;
    this.wallet = wallet;
  }

  buildMessageScript({ content, channel }: { content: string, channel: string }): bsv.Script {

    const dataPayload = [
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
      channel,
    ];

    const script = bsv.Script.fromASM(
      `OP_0 OP_RETURN ${ 
        dataPayload
          .map((str) => bops.to(bops.from(str, "utf8"), "hex"))
          .join(" ")}`,
    );

    return script;

  }

  async sendMessage({ content, channel }: { content: string, channel:string }): Promise<bsv.Transaction> {

    const script = this.buildMessageScript({ content, channel });

    const tx: bsv.Transaction = await this.wallet.createTransaction({

      outputs: [new bsv.Transaction.Output({
        script,
        satoshis: 10,
      })],

    });

    axios.post("https://b.map.sv/ingest", {
      rawTx: tx.toString(),
    })
    .catch(console.error);

    axios.get(`https://www.pow.co/api/v1/content/${tx.hash}`).catch(console.error);

    axios.get(`https://www.pow.co/api/v1/chat/messages/${tx.hash}`).catch(console.error);

    return tx;

  }

}

const ChatComposer = ({
  channel,
  onNewMessageSent,
  onChatImported,
}: ChatComposerProps) => {

  const [inputValue, setInputValue] = useState("");

  const [walletPopupOpen, setWalletPopupOpen] = useState(false);
  const { authenticated } = useBitcoin();

  const [sending, setSending] = useState(false);

  const [rows, setRows] = useState(1);

  const wallet = useWallet();

  const handleSubmit = async () => {

    if (!authenticated || !wallet) {
      setWalletPopupOpen(true);
      return;
    }

    const content = inputValue;

    console.log({ content, wallet });

    if (content !== "" && wallet.paymail) {

      console.log('paymail', wallet.paymail);

      setInputValue("");

      setSending(true);
      
      const client = new BitchatClient({ app: 'pow.co', wallet });

      const pendingMsg = {
        bmap: {
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
          },
        },
        createdAt: moment(),
      };

      onNewMessageSent(pendingMsg);

      await client.sendMessage({ content, channel });

      setSending(false);

      if (onChatImported) {
        console.log({ pendingMsg });
        onChatImported(pendingMsg);
      }

    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { value } = e.target as HTMLTextAreaElement;
    const rows = value.split("\n").length;
    setRows(rows);
    // dispatch typing action
  };

  const handleChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setInputValue((event.target as HTMLTextAreaElement).value);
  };

  return (
    <>
    <div className="w-full items-center border-t-0 bg-white py-2 dark:border-white/20 dark:bg-gray-800">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-3xl"
      >
        <div className="relative flex h-full flex-1 md:flex-col">
          <div className="relative flex w-full grow flex-col rounded-md border border-black/10 bg-white py-2 shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:border-gray-900/50 dark:bg-gray-700 dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)] md:py-3 md:pl-4">
            <textarea
              name="msg_content"
              value={inputValue}
              rows={rows}
              onChange={handleChange}
              autoComplete="off"
              className="m-0 w-full resize-none appearance-none border-0 bg-transparent p-0  pl-2 focus:outline-none focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0"
              style={{ height: rows > 1 ? "48px" : "24px", maxHeight: "48px" }}
              placeholder={`${
                sending ? "Sending..." : `Message in ${channel} chat`
              }`}
              onKeyUp={handleKeyUp}
              onKeyDown={handleKeyDown}
              aria-label="Message input"
            />
            <button type="submit" className="hidden" aria-label="Send message">Send</button>
          </div>
        </div>
      </form>
    </div>
    <Drawer
      selector="#walletProviderPopupControler"
      isOpen={walletPopupOpen}
      onClose={() => setWalletPopupOpen(false)}
    >
      <WalletProviderPopUp onClose={() => setWalletPopupOpen(false)} />
    </Drawer>
    </>
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
