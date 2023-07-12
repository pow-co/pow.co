
const MAP_PREFIX = "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5";

const bs58check = require('bs58check')

module.exports.buildInscriptionASM = function({ address, dataB64, contentType, metaData }) {

  const ord = Buffer.from('ord', 'utf8').toString('hex')

  const addressPayload = Buffer.from(bs58check.decode(address))

  const addressVersion = addressPayload.readUint8(0);

  const addressHash = addressPayload.slice(1).toString('hex');

  const p2pkh = `OP_DUP OP_HASH160 ${addressHash} OP_EQUALVERIFY OP_CHECKSIG`

  const data = Buffer.from(dataB64, 'base64').toString('hex')

  const mapPrefixHex = toHex(MAP_PREFIX);

  const mapCmdValue = toHex("SET");

  let inscriptionAsm = `${p2pkh} 0 OP_IF ${ord} OP_1 ${data} 0 ${toHex(contentType)} OP_ENDIF`

  inscriptionAsm = `${inscriptionAsm} OP_RETURN ${mapPrefixHex} ${mapCmdValue}`;

  for (const [key, value] of Object.entries(metaData)) {
    if (key !== "cmd") {
      inscriptionAsm = `${inscriptionAsm} ${Buffer.from(key, 'utf8').toString('hex')} ${Buffer.from(value, 'utf8').toString("hex")}`
    }
  }

  return inscriptionAsm
}

function toHex(s) {
  return Buffer.from(s, 'utf8').toString("hex")
}

module.exports.toHex = toHex
