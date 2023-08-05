
import axios from "axios";

const Message = require('./message')


import { Buffer } from "buffer";
export type AuthToken = {
  type: "header" | "query";
  value: string;
  key: string;
};


import { bsv } from 'scrypt-ts'

const { Transaction, Script, Address, PrivateKey, Signature } = bsv

export type RemoteSigningResponse = {
  address: string;
  sig: string;
  message: string;
  ts: number;
};

export const sigmaHex = "5349474d41";
export enum Algorithm {
  "BSM" = "BSM",
}

export type Sig = {
  address: string;
  signature: string;
  algorithm: Algorithm;
  vin: number;
  targetVout: number;
};

export interface SignResponse extends Sig {
  sigmaScript: Script;
  signedTx: Transaction;
}

export class Sigma {
  private _inputHash: string | null = null;
  private _dataHash: string | null = null;
  private _transaction: Transaction;
  private _sigmaInstance: number;
  private _refVin: number;
  private _targetVout: number;
  private _sig: Sig | null;

  constructor(
    transaction: Transaction,
    targetVout: number = 0,
    sigmaInstance: number = 0,
    refVin: number = 0
  ) {
    this._transaction = transaction;
    this._targetVout = targetVout;
    this._refVin = refVin;
    this._sigmaInstance = sigmaInstance;
    this._sig = this.sig;
    this.setHashes();
  }

  setHashes = () => {
    this._inputHash = this.getInputHash();
    this._dataHash = this.getDataHash();
  };

  setTargetVout = (targetVout: number) => {
    this._targetVout = targetVout;
  };

  setSigmaInstance = (sigmaInstance: number) => {
    this._sigmaInstance = sigmaInstance;
  };

  getMessageHash(): string {
    if (!this._inputHash || !this._dataHash) {
      throw new Error("Input hash and data hash must be set");
    }

    const inputBytes = this._inputHash
    const dataBytes = this._dataHash
    const combinedHashes = new Uint8Array(inputBytes.length + dataBytes.length);
    combinedHashes.set(inputBytes, 0);
    combinedHashes.set(dataBytes, inputBytes.length);

    const hex = Buffer.from(combinedHashes)

    const hash = bsv.crypto.Hash.sha256(hex)

    return hash.toString('hex')
  }

  get transaction(): Transaction {
    return this._transaction;
  }

  _sign(signature: string, address: string) {

    const vin = this._refVin === -1 ? this._targetVout : this._refVin;
    const signedAsm = `${sigmaHex} ${Buffer.from(
      Algorithm.BSM,
      "utf-8"
    ).toString("hex")} ${Buffer.from(address, "utf-8").toString(
      "hex"
    )} ${signature} ${Buffer.from(
      vin.toString(),
      "utf-8"
    ).toString("hex")}`;

    const sigmaScript = Script.fromASM(signedAsm);

    this._sig = {
      algorithm: Algorithm.BSM,
      address: address,
      signature: Buffer.from(signature, 'hex').toString("base64"),
      vin,
      targetVout: this._targetVout,
    };

    let existingAsm = this.targetTxOut?.script.toASM();
    const containsOpReturn = existingAsm?.split(" ").includes("OP_RETURN");
    const separator = containsOpReturn ? "7c" : "OP_RETURN";

    let newScriptAsm = "";

    const existingSig = this.sig;

    // sigmaIndex is 0 based while count is 1 based
    if (existingSig && this._sigmaInstance === this.getSigInstanceCount()) {
      // Replace the existing signature
      const scriptChunks = existingAsm?.split(" ") || [];

      const sigIndex = this.getSigInstancePosition();

      const newSignedAsmChunks = signedAsm.split(" ");
      if (sigIndex !== -1) {
        existingAsm = scriptChunks
          .splice(sigIndex, 5, ...newSignedAsmChunks)
          .join("");
      }
    }
    // Append the new signature
    newScriptAsm = `${existingAsm} ${separator} ${signedAsm}`;

    const newScript = Script.fromASM(newScriptAsm);

    (window as any)['newScript'] = newScript

    const signedTx = this._transaction;

    const signedTxOut = new bsv.Transaction.Output({
      satoshis: this.targetTxOut!.satoshis,
      script: newScript
    });

    signedTx.setOutput(this._targetVout, signedTxOut);

    // update the object state
    this._transaction = signedTx;

    return {
      sigmaScript,
      signedTx,
      ...this._sig,
    };
  }
  // Sign with Sigma protocol
  // privateKey: a bsv-wasm PrivateKey
  // inputs: either an array of TxIn from bsv-wasm or an array o string txids
  //    must be in the same order they are added to the transaction
  //    adding input txids to the signature scheme eliminates replay attacks
  // dataHash: a sha256 hash of the data to be signed
  //     it should include all the data in the output script prior to the "SIGMA" protocol instance
  //     excluding the "|" protocol separator and "SIGMA" prefix itself
  sign(privateKey: PrivateKey): SignResponse {

    const message = new Message(this.getMessageHash().toString())

    let signature = message.sign(privateKey)

    signature = Buffer.from(signature, 'utf8').toString('hex')

    const address = privateKey.toPublicKey().toAddress().toString()

    return this._sign(signature, address);
  }

  async remoteSign(
    keyHost: string,
    authToken?: AuthToken
  ): Promise<SignResponse> {
    const headers = authToken
      ? {
          [authToken?.key]: authToken?.value,
        }
      : {};

    try {
      const response = await axios.post(
        `${keyHost}/sign${
          authToken?.type === "query"
            ? "?" + authToken?.key + "=" + authToken?.value
            : ""
        }`,
        {
          message: this.getMessageHash().to_hex(),
          encoding: "hex",
        },
        {
          headers: {
            ...headers,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const { address, message, sig } = response.data as RemoteSigningResponse;

      const signature = Signature.from_compact_bytes(
        Buffer.from(sig, "base64")
      );
      return this._sign(signature, address);
    } catch (error: any) {
      console.error(error);
      // handle error
      throw new Error(error.response);
    }
  }

  verify = () => {
    if (!this.sig) {
      throw new Error("No signature data provided");
    }
    if (!this.getMessageHash()) {
      throw new Error("No tx data provided");
    }

    const p2pkhAddress = P2PKHAddress.from_string(this.sig.address);
    const signature = Signature.from_compact_bytes(
      Buffer.from(this.sig.signature, "base64")
    );

    return p2pkhAddress.verify_bitcoin_message(
      this.getMessageHash().to_bytes(),
      signature
    );
  };

  getInputHash = (): Hash => {
    // if vin is -1, we're signing the corresponding input
    // so we use this._targetVout as the vin
    // this allows for better compatibility with partially signed transactions
    // where the anchor input index is not known
    const vin = this._refVin === -1 ? this._targetVout : this._refVin;
    return this._getInputHashByVin(vin);
  };

  private _getInputHashByVin = (vin: number): Buffer => {
    const txIn = this._transaction.inputs[vin];
    if (txIn) {
      return Buffer.from(txIn.prevTxId)
    }
    // using dummy hash
    return bsv.crypto.Hash.sha256(bsv.crypto.Random.getRandomBuffer(32));
  };

  // gets the Hash.sha256 for a given sigma instance within an output script
  // an example of 2 instances would be a user signature followed by a platform signature
  getDataHash = (): Hash => {
    if (!this._transaction) {
      throw new Error("No transaction provided");
    }
    const outputScript = this._transaction
      ?.outputs[this._targetVout]
      ?.script

    const scriptChunks = outputScript?.toASM().split(" ") || [];

    // loop over the script chunks and set the endIndex when the nTh instance is found
    let occurances = 0;
    for (let i = 0; i < scriptChunks.length; i++) {
      if (scriptChunks[i].toUpperCase() === sigmaHex.toUpperCase()) {
        if (occurances === this._sigmaInstance) {
          // the -1 is to account for either the OP_RETURN
          // or "|" separator which is not signed
          const dataChunks = scriptChunks.slice(0, i - 1);
          const dataScript = Script.from_asm_string(dataChunks.join(" "));
          return bsv.crypto.Hash.sha256(dataScript.to_bytes());
        }
        occurances++;
      }
    }

    // If no endIndex found, return the hash for the entire script
    const dataScript = Script.fromASM(scriptChunks.join(" "));
    return bsv.crypto.Hash.sha256(dataScript.toBuffer());
  };

  get targetTxOut(): bsv.Transaction.Output | null {
    return this._transaction?.outputs[this._targetVout] || null;
  }

  // get the signature from the selected sigma instance
  get sig(): Sig | null {

    const output = this._transaction.outputs[this._targetVout];

    const outputScript = output?.script;

    const scriptChunks = outputScript?.toASM().split(" ") || [];
    const instances: Sig[] = [];

    for (let i = 0; i < scriptChunks.length; i++) {

      if (scriptChunks[i].toUpperCase() === sigmaHex.toUpperCase()) {
        const sig = {
          algorithm: Buffer.from(scriptChunks[i + 1], "hex").toString("utf-8"),
          address: Buffer.from(scriptChunks[i + 2], "hex").toString("utf-8"),
          signature: Buffer.from(scriptChunks[i + 3], "hex").toString("base64"),
          vin: parseInt(
            Buffer.from(scriptChunks[i + 4], "hex").toString("utf-8")
          ),
        } as Sig;

        instances.push(sig);

        // fast forward to the next possible instance position
        // 3 fields + 1 extra for the "|" separator
        i += 4;
      }
    }
    return instances.length === 0 ? this._sig : instances[this._sigmaInstance];
  }

  getSigInstanceCount(): number {
    const existingAsm = this.targetTxOut?.script.toASM();
    const scriptChunks = existingAsm?.split(" ") || [];
    return scriptChunks.filter(
      (chunk) => chunk.toUpperCase() === sigmaHex.toUpperCase()
    ).length;
  }

  getSigInstancePosition(): number {
    const existingAsm = this.targetTxOut?.script.toASM();
    const scriptChunks = existingAsm?.split(" ") || [];
    return scriptChunks.findIndex(
      (chunk) => chunk.toUpperCase() === sigmaHex.toUpperCase()
    );
  }
}
