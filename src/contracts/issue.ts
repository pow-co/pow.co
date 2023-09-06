/* eslint-disable prefer-rest-params */
import {
    assert,
    ByteString,
    method,
    prop,
    hash256,
    SmartContract,
    PubKey,
    Sig,
    Utils,
    hash160,
    toByteString,
  } from "scrypt-ts";
  
  export class Issue extends SmartContract {
    @prop(true)
    title: ByteString;

    @prop(true)
    description: ByteString;

    @prop(true)
    organization: ByteString;

    @prop(true)
    repo: ByteString;

    @prop(true)
    assignee: PubKey;
    
    @prop(true)
    owner: PubKey;

    @prop(true)
    closed: boolean;

    @prop(true)
    completed: boolean;

    constructor(
      title: ByteString,
      description: ByteString,
      repo: ByteString,
      organization: ByteString,
      owner: PubKey,
      assignee: PubKey,
    ) {
      super(...arguments);
      this.title = title;
      this.description = description;
      this.repo = repo;
      this.organization = organization;
      this.owner = owner;
      this.assignee = assignee;
      this.closed = false;
      this.completed = false;
    }

    static create(args: {
      title: string,
      description: string,
      repo: string,
      organization: string,
      owner: string,
      assignee: string,
    }): Issue {

      const title = toByteString(args.title, true);
      const description = toByteString(args.description, true);
      const repo = toByteString(args.repo, true);
      const organization = toByteString(args.organization, true);
      const owner = PubKey(args.owner);
      const assignee = PubKey(args.assignee);

      return new Issue(title, description, repo, organization, owner, assignee);
    }

    toJSON(): {
      title: string,
      description: string,
      repo: string,
      organization: string,
      owner: string,
      assignee: string,
      closed: boolean,
      completed: boolean,
    } {

      return {
        title: Buffer.from(this.title, 'hex').toString('utf8'),
        description: Buffer.from(this.description, 'hex').toString('utf8'),
        repo: Buffer.from(this.repo, 'hex').toString('utf8'),
        organization: Buffer.from(this.organization, 'hex').toString('utf8'),
        owner: this.owner.toString(),
        assignee: this.assignee.toString(),
        closed: this.closed,
        completed: this.completed      
      }
      
    }
  
    @method()
    public close(completed: boolean, sig: Sig) {
      assert(
        this.checkSig(sig, this.owner),
        `checkSig failed, pubkey: ${this.owner}`,
      );
  
      this.closed = true;

      this.completed = completed;
  
      let outputs: ByteString = this.buildStateOutput(this.ctx.utxo.value);
      if (this.changeAmount > 0n) {
        outputs += this.buildChangeOutput();
      }
      assert(this.ctx.hashOutputs === hash256(outputs), 'state not preserved');
    }

    @method()
    public complete(sig: Sig) {
      assert(
        this.checkSig(sig, this.owner),
        `checkSig failed, pubkey: ${this.owner}`
      );      
  
      this.closed = true;

      this.completed = true;

      const finalBalance = 1n

      const currentBalance = this.ctx.utxo.value

      const bountyAmount = currentBalance - finalBalance;

      let outputs: ByteString = this.buildStateOutput(finalBalance);

      const bounty = Utils.buildPublicKeyHashOutput(hash160(this.assignee), bountyAmount);

      outputs += bounty;

      if (this.changeAmount > 0n) {
        outputs += this.buildChangeOutput();
      }

      assert(this.ctx.hashOutputs === hash256(outputs), 'state not preserved');
    }

    @method()
    public assign(assignee: PubKey, sig: Sig) {
      assert(
        this.checkSig(sig, this.owner),
        `checkSig failed, pubkey: ${this.owner}`
      );
  
      this.assignee = assignee;
  
      let outputs: ByteString = this.buildStateOutput(this.ctx.utxo.value);
      if (this.changeAmount > 0n) {
        outputs += this.buildChangeOutput();
      }

      assert(this.ctx.hashOutputs === hash256(outputs), 'state not preserved');
    }

    @method()
    public addBounty(contribution: bigint) {

      assert(!this.closed, 'issue must be open to receive a bounty')
  
      const bounty = this.ctx.utxo.value + contribution;

      let outputs: ByteString = this.buildStateOutput(bounty);
      
      if (this.changeAmount > 0n) {
        outputs += this.buildChangeOutput();
      }

      assert(this.ctx.hashOutputs === hash256(outputs), 'state not preserved');
    }

    @method()
    public addComment(comment: ByteString, commenter: PubKey, sig: Sig) {
      assert(
        this.checkSig(sig, commenter),
        `checkSig failed, pubkey: ${commenter}`,
      );

      let outputs: ByteString = this.buildStateOutput(this.ctx.utxo.value);
      if (this.changeAmount > 0n) {
        outputs += this.buildChangeOutput();
      }

      assert(this.ctx.hashOutputs === hash256(outputs), 'state not preserved');
    }

    @method()
    public reopen(sig: Sig) {
      assert(
        this.checkSig(sig, this.owner),
        `checkSig failed, pubkey: ${this.owner}`,
      );
  
      this.closed = false;

      this.completed = false;
  
      let outputs: ByteString = this.buildStateOutput(this.ctx.utxo.value);
      if (this.changeAmount > 0n) {
        outputs += this.buildChangeOutput();
      }
      assert(this.ctx.hashOutputs === hash256(outputs), 'state not preserved');
    }

    public getBounty(): bigint {
      return BigInt(this.balance - 1);
    }
    
  }
