import {
    method,
    prop,
    SmartContract,
    hash256,
    hash160,
    assert,
    ByteString,
    SigHash,
    PubKey,
    PubKeyHash,
    Sig
} from 'scrypt-ts'

export class TimeLockP2PKH extends SmartContract {
    @prop()
    matureTime: bigint

    @prop()
    pubKeyHash: PubKeyHash

    constructor(pubKeyHash: PubKeyHash, matureTime: bigint) {
        super(...arguments)
        this.pubKeyHash = pubKeyHash
        this.matureTime = matureTime
    }

    @method()
    public unlock(signature: Sig, pubkey: PubKey) {
      assert(hash160(pubkey) === this.pubKeyHash)
      assert(this.checkSig(signature, pubkey), `checkSig failed, pubKeyHash: ${this.pubKeyHash}`)
      assert(this.ctx.locktime >= this.matureTime, "locktime too low")
    }

}
