import {
    method,
    prop,
    SmartContract,
    hash256,
    assert,
    ByteString,
    SigHash,
    PubKey
} from 'scrypt-ts'

export class DevIssue extends SmartContract {

    //@ts-ignore
    @prop(true)
    closed: boolean;

    //@ts-ignore
    @prop()
    version: ByteString;

    //@ts-ignore
    @prop()
    platform: ByteString;
 
    //@ts-ignore
    @prop()
    org: ByteString;

    //@ts-ignore
    @prop()
    repo: ByteString;

    //@ts-ignore
    @prop()
    issue_number: ByteString;

    //@ts-ignore
    @prop()
    title: ByteString;

    //@ts-ignore
    @prop()
    description: ByteString;

    constructor(
      version: ByteString,
      platform: ByteString,
      org: ByteString,
      repo: ByteString,
      issue_number: ByteString,
      title: ByteString,
      description: ByteString,
    ) {
        super(version, platform, org, repo, issue_number, title, description)
        this.version = version
        this.platform = platform
        this.org = org
        this.repo = repo
        this.issue_number = issue_number
        this.title = title
        this.description = description
        this.closed = false
    }

    //@ts-ignore
    @method(SigHash.ANYONECANPAY_SINGLE)
    public closeIssue() {
        this.closed = true
        // make sure balance in the contract does not change
        const amount: bigint = this.ctx.utxo.value
        // output containing the latest state
        const output: ByteString = this.buildStateOutput(amount)
        // verify current tx has this single output
        assert(this.ctx.hashOutputs === hash256(output), 'hashOutputs mismatch')
    }

    //@ts-ignore
    @method(SigHash.ANYONECANPAY_SINGLE)
    public reopenIssue() {
        this.closed = false
        // make sure balance in the contract does not change
        const amount: bigint = this.ctx.utxo.value
        // output containing the latest state
        const output: ByteString = this.buildStateOutput(amount)
        // verify current tx has this single output
        assert(this.ctx.hashOutputs === hash256(output), 'hashOutputs mismatch')
    }
}
