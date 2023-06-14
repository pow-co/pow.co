
class OrderLock {

  constructor(address, satoshis) {

    if (typeof address !== "string" || address.length < 27) {

      throw new TypeError("Invalid address");

    }

    if (typeof satoshis !== "number" || !Number.isInteger(satoshis)) {

      throw new Error("Invalid satoshis");

    }

    if (satoshis > Number.MAX_SAFE_INTEGER) {

      throw new Error("Invalid. Max: " + Number.MAX_SAFE_INTEGER);

    }

    if (satoshis < 546) {

      throw new Error("Dust");

    }

    this.address = address;

    this.satoshis = satoshis;

  }

  script() {

    const output = this.serializeOutput(this.address, this.satoshis);

    const hashOutput = this.sha256sha256(output);

    return (

      OrderLock.scriptTemplate.slice(0, 2) +
        hashOutput +
        OrderLock.scriptTemplate.slice(66)
    );

  }

  serializeOutput(address, satoshis) {

    const satoshisHex = this.serializeSatoshis(satoshis);

    const satoshisHexBytes = Hex.stringToBytes(satoshisHex);

    const outputScriptBytes = Hex.stringToBytes(this.getP2PKHScript(address));

    const lengthBytes = [25];

    return satoshisHexBytes.concat(lengthBytes, outputScriptBytes);

  }

  serializeSatoshis(satoshis) {

    let numberHex = ("0000000000000000" + satoshis.toString(16)).slice(-16);

    return numberHex
      .match(/[a-fA-F0-9]{2}/g)
      .reverse()
      .join("");
  }

  getP2PKHScript(address) {

    const decoded = Base58.decode(address);

    const hex = Hex.bytesToString(decoded);

    return asm(`OP_DUP OP_HASH160 ${hex} OP_EQUALVERIFY OP_CHECKSIG`);

  }

  sha256sha256(output) {

    return Hex.bytesToString(sha256(sha256(output)));

  }

  domain() {

    return 0;

  }

}
