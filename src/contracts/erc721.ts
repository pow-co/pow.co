import {
    assert,
    hash256,
    HashedMap,
    method,
    prop,
    PubKey,
    Sig,
    SigHash,
    SmartContract,
    ByteString
} from 'scrypt-ts'

// tokenId: ownerPubKey
type OwnerMap = HashedMap<bigint, PubKey>

/*
 * This contract demonstrates an implementation of a non-fungible token.
 * Specifically, it implements the ERC-721 interface.
 * Read our Medium article about implementing NFT's using sCrypt:
 * https://medium.com/@xiaohuiliu/non-fungible-tokens-on-bitcoin-sv-4575368f46a
 */
export class Erc721 extends SmartContract {
    @prop()
    minter: PubKey

    @prop(true)
    owners: OwnerMap

    @prop(true)
    name: ByteString

    @prop(true)
    description: ByteString

    @prop(true)
    image: ByteString

    @prop(true)
    metadata: ByteString

    constructor(
      minter: PubKey,
      owners: OwnerMap,
      name: ByteString,
      description: ByteString,
      image: ByteString,
      metadata: ByteString
    ) {
        super(...arguments)
        this.minter = minter
        this.owners = owners
        this.name = name
        this.description = description
        this.image = image
        this.metadata = metadata
    }

    // mint a new token to receiver
    @method(SigHash.SINGLE)
    public mint(tokenId: bigint, mintTo: PubKey, minterSig: Sig) {
        // require token was not minted before
        assert(!this.owners.has(tokenId), 'token was already minted before')
        // require the minter to provide a signature before minting
        assert(
            this.checkSig(minterSig, this.minter),
            'minter signature check failed'
        )
        // set token belongs to the receiver
        this.owners.set(tokenId, mintTo)
        // validate hashOutputs
        assert(
            this.ctx.hashOutputs ==
                hash256(this.buildStateOutput(this.ctx.utxo.value)),
            'hashOutputs check failed'
        )
    }

    // burn a token
    @method(SigHash.SINGLE)
    public burn(tokenId: bigint, sender: PubKey, sig: Sig) {
        // verify ownership
        assert(
            this.owners.canGet(tokenId, sender),
            "sender doesn't have the token"
        )
        // verify sender's signature
        assert(this.checkSig(sig, sender), 'sender signature check failed')
        // remove token from owners
        assert(this.owners.delete(tokenId), 'token burn failed')
        // validate hashOutputs
        assert(
            this.ctx.hashOutputs ==
                hash256(this.buildStateOutput(this.ctx.utxo.value)),
            'hashOutputs check failed'
        )
    }

    // transfer a token from sender to receiver
    @method(SigHash.SINGLE)
    public transferFrom(
        tokenId: bigint,
        sender: PubKey,
        sig: Sig,
        receiver: PubKey
    ) {
        // verify ownership
        assert(
            this.owners.canGet(tokenId, sender),
            "sender doesn't have the token"
        )
        // verify sender's signature
        assert(this.checkSig(sig, sender), 'sender signature check failed')
        // change token owner
        this.owners.set(tokenId, receiver)
        // validate hashOutputs
        assert(
            this.ctx.hashOutputs ==
                hash256(this.buildStateOutput(this.ctx.utxo.value)),
            'hashOutputs check failed'
        )
    }
}
