import React, { useCallback } from "react";

import nimble from "@runonbitcoin/nimble";
//import { BAP } from "bitcoin-bap";
import bops from "bops";
import bsv from "bsv";
//import Buffer from "Buffer";
import { last } from "lodash";
import { useDispatch, useSelector } from "react-redux";
//import { useBap } from "../../context/bap";
//import { useHandcash } from "../../context/handcash";
import { useRelay } from "../context/RelayContext";
//import { useActiveChannel } from "../../hooks";
//import ChannelTextArea from "./ChannelTextArea";
//import InvisibleSubmitButton from "./InvisibleSubmitButton";


const ChatComposer = () => {
  //const dispatch = useDispatch();
  // const user = useSelector((state) => state.session.user);
  const { relayOne, paymail } = useRelay();

  //const { profile, authToken, hcDecrypt } = useHandcash();
  //const { identity } = useBap();

  //const activeChannel = useActiveChannel();
  const channelId = "askbitcoin"//duplicate on chatcomposer//last(window.location.pathname.split("/"));
  let timeout = undefined;

  const handleSubmit = useCallback(
    async (event) => {
      //console.log(event)
      event.preventDefault()
      if (!paymail){
        alert("Please, connect your wallet")
          return
      }

      const content = event.target.msg_content.value;

      if (content !== "" && paymail) {
        await sendMessage(
          paymail,
          content,
          channelId //activeChannel?.channel || channelId || null
        );
        event.target.reset();
      }
    },
    [paymail]
    //[activeChannel, paymail, profile]
  );

  const sendMessage = useCallback(
    async (pm, content, channel) => {
        let dataPayload = [
          B_PREFIX, // B Prefix
          content,
          "text/plain",
          "utf-8",
          "|",
          MAP_PREFIX, // MAP Prefix
          "SET",
          "app",
          "pow.co",
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
        let outputs = [{ script: script.toASM(), amount: 0, currency: "BSV" }];
        let resp = await relayOne.send({ outputs });

        console.log("Sent", resp);
        let txid = resp.txid;
    },
    [relayOne]//[identity, relayOne, authToken]
  );

  //const typingUser = useSelector((state) => state.chat.typingUser);

  // TODO: Detect whether the user is typing
  const handleKeyDown = (event) => {
    let ctrlDown = false;
    let ctrlKey = 17;
    let cmdKey = 91;
    let vKey = 86;
    let cKey = 67;

    if (event.keyCode == ctrlKey || event.keyCode == cmdKey) ctrlDown = true;

    if (ctrlDown && event.keyCode == cKey) console.log("Document catch Ctrl+C");
    if (ctrlDown && event.keyCode == vKey) console.log("Document catch Ctrl+V");
  };

  const handleKeyUp = (event) => {
    const enterKey = 13;
    let ctrlDown = false;
    let ctrlKey = 17;
    let cmdKey = 91;
    let vKey = 86;
    let cKey = 67;

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

  return (
    <div className="my-2 sm:my-5 ">
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          name="msg_content"
          autoComplete="off"
          className="flex flex-col p-3 rounded-lg sm:rounded-xl  bg-gray-200  dark:bg-gray-600 w-full focus:outline-none"
          placeholder="Message in askbitcoin chat"
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" className="hidden"/>
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