
import {
    assert,
    ByteString,
    method,
    prop,
    SmartContract,
    Sig,
    PubKey,
    toByteString,
    DefaultProvider,
    SensiletSigner,
    bsv,
    MethodCallOptions,
    findSig
} from 'scrypt-ts'

export {
  DefaultProvider,
  SensiletSigner,
  bsv
}

export class PersonalInterest extends SmartContract {
    @prop()
    owner: PubKey

    @prop()
    topic: ByteString

    @prop(true)
    weight: BigInt

    constructor(topic: ByteString, owner: PubKey, weight: BigInt = 1n) {
        super(...arguments)
        this.topic = topic
        this.owner = owner
        this.weight = weight
    }

    static build({
      topic,
      playerPublicKey,
      weight
    }: {
      topic: string,
      playerPublicKey: string,
      weight: BigInt
    }) {

      return new this(
        toByteString(topic, true),
        PubKey(playerPublicKey),
        weight
      )

    }

    @method()
    public setValue(signature: Sig) {

      assert(this.checkSig(signature, this.owner), `checkSig failed, pubkey: ${this.owner}`)
    }

    @method()
    public setWeight(weight: bigint, signature: Sig) {

      this.weight = weight

      assert(this.checkSig(signature, this.owner), `checkSig failed, pubkey: ${this.owner}`)
    }

    @method()
    public remove(signature: Sig) {

      assert(this.checkSig(signature, this.owner), `checkSig failed, pubkey: ${this.owner}`)
    }

}

export async function removeInterest(instance: PersonalInterest, publickey: string, address: string) {

    const result = await instance.methods.remove((sigResps: any) =>{
      return findSig(sigResps, new bsv.PublicKey(publickey))
    }, {
      pubKeyOrAddrToSign: new bsv.PublicKey(publickey).toAddress()
    } as MethodCallOptions<PersonalInterest>)

    return result

}
