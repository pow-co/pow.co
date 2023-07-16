import {
    method,
    prop,
    SmartContract,
    hash256,
    assert,
    Sig,
    ByteString,
    SigHash
} from 'scrypt-ts'

export class TimeLock extends SmartContract {

    @prop(true)
    owner: PubKey

    @prop()
    matureTime: bigint

    constructor(owner: PubKey, matureTime: bigint) {
      super(owner, matureTime)
      this.owner = owner
      this.matureTime = matureTime
    }

    @method()
    public transfer(newOwner: PubKey, signature: Sig) {
      // No assertion that the state out remains the same. By calling remove() you essentially
      // destroy the smart contract and may reclaim all the satoshis
      this.owner = newOwner;

      // make sure balance in the contract does not change
      const amount: bigint = this.ctx.utxo.value
      // output containing the latest state
      const output: ByteString = this.buildStateOutput(amount)
      // verify current tx has this single output
      assert(this.ctx.hashOutputs === hash256(output), 'hashOutputs mismatch')


      assert(this.checkSig(signature, this.owner), `checkSig failed, pubkey: ${this.owner}`)
    }

    @method()
    public unlock(signature: Sig) {
      assert(this.checkSig(signature, this.owner), `checkSig failed, pubkey: ${this.owner}`)
      assert(this.ctx.locktime >= this.matureTime, "locktime too low")
    }
}
