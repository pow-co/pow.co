import {
    method,
    prop,
    SmartContract,
    hash256,
    assert,
    ByteString,
    SigHash,
    PubKey,
    Sig
} from 'scrypt-ts'

export class TimeLockP2PK extends SmartContract {
    @prop()
    matureTime: bigint

    @prop()
    owner: PubKey

    constructor(owner: PubKey, matureTime: bigint) {
        super(owner, matureTime)
        this.owner = owner
        this.matureTime = matureTime
    }

    @method()
    public unlock(signature: Sig) {
      assert(this.checkSig(signature, this.owner), `checkSig failed, pubkey: ${this.owner}`)
      assert(this.ctx.locktime >= this.matureTime, "locktime too low")
    }

}
