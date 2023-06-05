
// https://whatsonchain.com/tx/d6170025a62248d8df6dc14e3806e68b8df3d804c800c7bfb23b0b4232862505

module.exports = {
  "in": 0,
  "ref": [
    "81bcef29b0e4ed745f3422c0b764a33c76d0368af2d2e7dd139db8e00ee3d8a6_o1",
    "727e7b423b7ee40c0b5be87fba7fa5673ea2d20a74259040a7295d9c32a90011_o1",
    "49145693676af7567ebe20671c5cb01369ac788c20f3b1c804f624a1eda18f3f_o1",
    "3b7ef411185bbe3d01caeadbe6f115b0103a546c4ef0ac7474aa6fbb71aff208_o1"
  ],
  "out": [
    "fad5858db1bb99d59b7685c860f3fa655f3edfaa78436b9565f8ff41a8b123c7"
  ],
  "del": [],
  "cre": [
    "1Ne4Bd76Hr88R3YKYWejW164DDE7EEGjPX"
  ],
  "exec": [
    {
      "op": "DEPLOY",
      "data": [
        "class OrderLock {\r\n  constructor(address, satoshis) {\r\n    if (typeof address !== \"string\" || address.length < 27) {\r\n      throw new TypeError(\"Invalid address\");\r\n    }\r\n    if (typeof satoshis !== \"number\" || !Number.isInteger(satoshis)) {\r\n      throw new Error(\"Invalid satoshis\");\r\n    }\r\n    if (satoshis > Number.MAX_SAFE_INTEGER) {\r\n      throw new Error(\"Invalid. Max: \" + Number.MAX_SAFE_INTEGER);\r\n    }\r\n    if (satoshis < 546) {\r\n      throw new Error(\"Dust\");\r\n    }\r\n    this.address = address;\r\n    this.satoshis = satoshis;\r\n  }\r\n  script() {\r\n    const output = this.serializeOutput(this.address, this.satoshis);\r\n    const hashOutput = this.sha256sha256(output);\r\n    return (\r\n      OrderLock.scriptTemplate.slice(0, 2) +\r\n      hashOutput +\r\n      OrderLock.scriptTemplate.slice(66)\r\n    );\r\n  }\r\n  serializeOutput(address, satoshis) {\r\n    const satoshisHex = this.serializeSatoshis(satoshis);\r\n    const satoshisHexBytes = Hex.stringToBytes(satoshisHex);\r\n    const outputScriptBytes = Hex.stringToBytes(this.getP2PKHScript(address));\r\n    const lengthBytes = [25];\r\n    return satoshisHexBytes.concat(lengthBytes, outputScriptBytes);\r\n  }\r\n  serializeSatoshis(satoshis) {\r\n    let numberHex = (\"0000000000000000\" + satoshis.toString(16)).slice(-16);\r\n    return numberHex\r\n      .match(/[a-fA-F0-9]{2}/g)\r\n      .reverse()\r\n      .join(\"\");\r\n  }\r\n  getP2PKHScript(address) {\r\n    const decoded = Base58.decode(address);\r\n    const hex = Hex.bytesToString(decoded);\r\n    return asm(`OP_DUP OP_HASH160 ${hex} OP_EQUALVERIFY OP_CHECKSIG`);\r\n  }\r\n  sha256sha256(output) {\r\n    return Hex.bytesToString(sha256(sha256(output)));\r\n  }\r\n  domain() {\r\n    return 0;\r\n  }\r\n}",
        {
          "deps": {
            "Base58": {
              "$jig": 0
            },
            "Hex": {
              "$jig": 1
            },
            "asm": {
              "$jig": 2
            },
            "sha256": {
              "$jig": 3
            }
          },
          "scriptTemplate": "20000000000000000000000000000000000000000000000000000000000000000001c35279630142517a75547901687f7501447f77007901207f7504000000007e517951797e56797eaa577901247f75547f77876975756754795579827758947f75557982770128947f77527987696861547921cdb285cc49e5ff3eed6536e7b426e8a528b05bf9276bd05431a671743e651ceb002102dca1e194dd541a47f4c85fea6a4d45bb50f16ed2fddc391bf80b525454f8b40920f941a26b1c1802eaa09109701e4e632e1ef730b0b68c9517e7c19be2ba4c7d37202f282d163597a82d72c263b004695297aecb4d758dccd1dbf61e82a3360bde2c202cde0b36a3821ef6dbd1cc8d754dcbae97526904b063c2722da89735162d282f56795679aa616100790079517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e01007e81517a756157795679567956795679537956795479577995939521414136d08c5ed2bf3ba048afe6dcaebafeffffffffffffffffffffffffffffff0061517951795179517997527a75517a5179009f635179517993527a75517a685179517a75517a7561527a75517a517951795296a0630079527994527a75517a68537982775279827754527993517993013051797e527e53797e57797e527e52797e5579517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7e56797e0079517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a756100795779ac517a75517a75517a75517a75517a75517a75517a75517a75517a75617777777777",
          "scrypt": "contract OrderLock {\n  // double hash of designated output, i.e. hash256(satoshis + varint + output script)\n  Sha256 hashOutput;\n\n  // trailingPrevouts = concat all inputs (txid1 + vout1 + txid2 + vout2 + ...),\n  // excluding first 2 inputs, i.e. cancel baton input and self input\n  public function unlock(SigHashPreimage preimage, bytes trailingPrevouts, bool isCancel) {\n      // c3 = SIGHASH_SINGLE | ANYONECANPAY, checks self input, self output\n      SigHashType sigHashType = SigHashType(b'c3');\n      if (isCancel) {\n          // 42 = SIGHASH_NONE, checks all inputs, no outputs\n          sigHashType = SigHashType(b'42');\n          // token lock input txid + vout, 32 + 4 bytes\n          bytes selfOutpoint = preimage[68 : 104];\n          // cancel baton input, same locking tx as token lock input, vout must be 0\n          bytes cancelOutpoint = selfOutpoint[: 32] + b'00000000';\n          // reconstruct full prevouts, double hash, check against preimage hashPrevouts\n          require(hash256(selfOutpoint + cancelOutpoint + trailingPrevouts) == preimage[4 : 36]);\n      } else {\n          // check against preimage hashOutputs, with SIGHASH_SINGLE, only self output is hashed\n          require(preimage[len(preimage) - 40 : len(preimage) - 8] == this.hashOutput);\n      }\n      // check preimage\n      require(Tx.checkPreimageAdvanced(\n          preimage,\n          PrivKey(0xeb1c653e7471a63154d06b27f95bb028a5e826b4e73665ed3effe549cc85b2cd),\n          PubKey(b'02dca1e194dd541a47f4c85fea6a4d45bb50f16ed2fddc391bf80b525454f8b409'),\n          0x377d4cbae29bc1e717958cb6b030f71e2e634e1e700991a0ea02181c6ba241f9,\n          0x2cde0b36a3821ef6dbd1cc8d754dcbae97526904b063c2722da89735162d282f,\n          b'2cde0b36a3821ef6dbd1cc8d754dcbae97526904b063c2722da89735162d282f',\n          sigHashType\n      ));\n  }\n}",
          "sealed": true,
          "upgradable": false
        }
      ]
    }
  ]
}
