import {
    toByteString,
    assert,
    ByteString,
    method,
    prop,
    sha256,
    Sha256,
    SmartContract,
} from 'scrypt-ts'

export class SuperChat extends SmartContract {
    @prop()
    message: ByteString

    constructor(message: ByteString) {
        super(...arguments)
        this.message = message
    }

    @method()
    public cancel() {
        assert(true)
    }

    static fromMessage(message: string): SuperChat {

      return new SuperChat(toByteString(message, true))

    }
}
