
import { bsv } from 'scrypt-ts'

import { Buffer } from "buffer";

import { Sigma } from './sigma'

export interface LocalSigner extends Signer {
  idKey: bsv.PrivateKey;
}

export type Utxo = {
  satoshis: number;
  txid: string;
  vout: number;
  script: string;
};

export type Inscription = {
  dataB64: string;
  contentType: string;
};

export type MAP = {
  app: string;
  type: string;
  [prop: string]: string | string[];
};

const MAP_PREFIX = "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5";

interface BuildInscription {
}

export function buildInscription(args: {
  destinationAddress: bsv.Address;
  dataB64?: string | undefined;
  contentType?: string | undefined;
  metaData?: MAP | undefined;
}): bsv.Script {

  const { dataB64, contentType, destinationAddress, metaData } = args

  let ordAsm = ''

  if (dataB64 !== undefined && contentType !== undefined) {
    const ordHex = toHex("ord");
    const fsBuffer = Buffer.from(dataB64, "base64");
    const fireShardHex = fsBuffer.toString("hex");
    const fireShardMediaType = toHex(contentType);
    ordAsm = `OP_0 OP_IF ${ordHex} OP_1 ${fireShardMediaType} OP_0 ${fireShardHex} OP_ENDIF`;
  }

  // Create ordinal output and inscription in a single output
  let inscriptionAsm = `${bsv.Script.fromAddress(destinationAddress).toASM()}${ordAsm ? " " + ordAsm : ""}`;

  // MAP.app and MAP.type keys are required
  if (metaData && metaData?.app && metaData?.type) {
    const mapPrefixHex = toHex(MAP_PREFIX);
    const mapCmdValue = toHex("SET");
    inscriptionAsm = `${inscriptionAsm} OP_RETURN ${mapPrefixHex} ${mapCmdValue}`;

    for (const [key, value] of Object.entries(metaData)) {
      if (key !== "cmd") {
        inscriptionAsm = `${inscriptionAsm} ${toHex(key)} ${toHex(
          value as string
        )}`;
      }
    }
  }

  return bsv.Script.fromASM(inscriptionAsm)

}

/*
export async function buildReinscriptionTemplate(args: {
  ordinal: Utxo;
  destinationAddress: string;
  reinscription?: Inscription;
  metaData?: MAP;
): Promise<bsv.Transaction> {

  return new bsv.Transaction()

}
*/

export async function createOrdinal(args: {
  utxo: Utxo,
  destinationAddress: string,
  paymentPk: PrivateKey,
  changeAddress: string,
  satPerByteFee: number,
  inscription: Inscription,
  metaData?: MAP,
  signer?: LocalSigner
}): Promise<bsv.Transaction> {

  console.log('createOrdinal', args)

  let tx = new bsv.Transaction()
  
  tx.from([args.utxo])

  // Outputs
  const inscriptionScript = buildInscription({
    destinationAddress: new bsv.Address(args.destinationAddress),
    dataB64: args.inscription.dataB64,
    contentType: args.inscription.contentType,
    metaData: args.metaData
  });

  let satOut = new bsv.Transaction.Output({
    script: inscriptionScript,
    satoshis: 1
  })

  tx.addOutput(satOut);

  let emptyOut = new bsv.Transaction.Output({
    script: bsv.Script.fromAddress(new bsv.Address(args.destinationAddress)),
    satoshis: 1
  })

  tx.change(args.changeAddress)

  const fee = Math.ceil(
    args.satPerByteFee * (tx._estimateSize() + emptyOut.toString().length)
  );

  tx.fee(fee)

  const idKey = (args.signer as LocalSigner)?.idKey;

  if (idKey) {
    const sigma = new Sigma(tx, args.utxo.vout);
    const { signedTx } = sigma.sign(idKey);
    tx = signedTx;
  }

  tx.sign(args.paymentPk)

  console.log('createOrdinal.result', { txhex: tx.toString(), txid: tx.hash })

  return tx

}

export async function sendOrdinal(args: {
  paymentUtxo: Utxo,
  ordinal: Utxo,
  paymentPk: PrivateKey,
  changeAddress: string,
  satPerByteFee: number,
  ordPk: PrivateKey,
  ordDestinationAddress: string,
  reinscription?: Inscription,
  metaData?: MAP
}): Promise<Transaction> {

}

export async function sendUtxos(args: {
  utxos: Utxo[],
  paymentPk: PrivateKey,
  address: P2PKHAddress,
  feeSats: number
}) {

}

const toHex = (asciiStr: string) => {
  var arr1: string[] = [];
  for (var n = 0, l = asciiStr.length; n < l; n++) {
    var hex = Number(asciiStr.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1.join("");
};
