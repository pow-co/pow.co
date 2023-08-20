import {
  assert,
  ByteString,
  method,
  prop,
  hash256,
  SmartContract,
  HashedSet,
  PubKey,
  Sig,
} from "scrypt-ts";

export class Meeting extends SmartContract {
  @prop(true)
  title: ByteString;

  @prop(true)
  description: ByteString;

  @prop(true)
  location: ByteString;

  @prop(true)
  url: ByteString;

  @prop(true)
  status: ByteString;

  @prop(true)
  start: bigint;

  @prop(true)
  end: bigint;

  @prop(true)
  organizer: PubKey;

  @prop(true)
  attendees: HashedSet<PubKey>;

  @prop(true)
  invitees: HashedSet<PubKey>;

  @prop(true)
  cancelled: boolean;

  @prop(true)
  inviteRequired: boolean;

  constructor(
    title: ByteString,
    description: ByteString,
    start: bigint,
    end: bigint,
    location: ByteString,
    url: ByteString,
    //categories: HashedSet<ByteString>,
    status: ByteString,
    organizer: PubKey,
    invitees: HashedSet<PubKey>,
    attendees: HashedSet<PubKey>,
    inviteRequired: boolean
  ) {
    super(...arguments);
    this.title = title;
    this.description = description;
    this.start = start;
    this.end = end;
    this.location = location;
    this.url = url;
    this.status = status;

    this.organizer = organizer;
    this.invitees = invitees;
    this.inviteRequired = inviteRequired;
    this.attendees = attendees;
    this.cancelled = false;
  }

  @method()
  public uncancel(sig: Sig) {
    assert(
      this.checkSig(sig, this.organizer),
      `checkSig failed, pubkey: ${this.organizer}`
    );

    this.cancelled = false;

    let outputs: ByteString = this.buildStateOutput(this.ctx.utxo.value);
    if (this.changeAmount > 0n) {
      outputs += this.buildChangeOutput();
    }
    assert(this.ctx.hashOutputs == hash256(outputs), "state not preserved");
  }

  @method()
  public invite(invitee: PubKey, sig: Sig) {
    assert(
      this.checkSig(sig, this.organizer),
      `checkSig failed, pubkey: ${this.organizer}`
    );

    if (!this.invitees.has(invitee) && !this.attendees.has(invitee)) {
      this.invitees.add(invitee);
    }

    let outputs: ByteString = this.buildStateOutput(this.ctx.utxo.value);
    if (this.changeAmount > 0n) {
      outputs += this.buildChangeOutput();
    }
    assert(this.ctx.hashOutputs == hash256(outputs), "state not preserved");
  }

  @method()
  public decline(pubkey: PubKey, sig: Sig) {
    assert(this.checkSig(sig, pubkey), `checkSig failed, pubkey: ${pubkey}`);

    if (this.invitees.has(pubkey)) {
      this.invitees.delete(pubkey);
    }

    if (this.attendees.has(pubkey)) {
      this.attendees.delete(pubkey);
    }

    let outputs: ByteString = this.buildStateOutput(this.ctx.utxo.value);
    if (this.changeAmount > 0n) {
      outputs += this.buildChangeOutput();
    }
    assert(this.ctx.hashOutputs == hash256(outputs), "state not preserved");
  }

  @method()
  public attend(pubkey: PubKey, sig: Sig) {
    assert(this.checkSig(sig, pubkey), `checkSig failed, pubkey: ${pubkey}`);

    if (this.inviteRequired) {
      assert(this.invitees.has(pubkey) || pubkey == this.organizer);
    }

    this.attendees.add(pubkey);

    let outputs: ByteString = this.buildStateOutput(this.ctx.utxo.value);
    if (this.changeAmount > 0n) {
      outputs += this.buildChangeOutput();
    }
    assert(this.ctx.hashOutputs == hash256(outputs), "state not preserved");
  }

  isAttending(pubkey: PubKey): boolean {
    return this.attendees.has(pubkey);
  }

  isInvited(pubkey: PubKey): boolean {
    return this.invitees.has(pubkey);
  }

  isOrganizer(pubkey: PubKey): boolean {
    return this.organizer == pubkey;
  }

  @method()
  public cancel(sig: Sig) {
    assert(
      this.checkSig(sig, this.organizer),
      `checkSig failed, pubkey: ${this.organizer}`
    );

    this.cancelled = true;

    let outputs: ByteString = this.buildStateOutput(this.ctx.utxo.value);
    if (this.changeAmount > 0n) {
      outputs += this.buildChangeOutput();
    }
    assert(this.ctx.hashOutputs == hash256(outputs), "state not preserved");
  }
}
