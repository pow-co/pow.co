/*

  EventTicket Smart Contract

  UX:

    - My Tickets
    - Buy Ticket
    - Refund Ticket
    - Redeem Ticket
    - List Events
    - Show Event
    - Admin My Receipts
    - Admin My Events

*/

import {
  method,
  prop,
  SmartContract,
  hash256,
  assert,
  ByteString,
  SigHash,
  PubKey,
  toByteString,
} from "scrypt-ts";

export class EventTicket extends SmartContract {
  @prop()
  payee: PubKey;

  // for ticket to be valid it must contain enough satoshis
  @prop()
  price: BigInt;

  @prop()
  owner: PubKey;

  // reference to a CalendarEvent blockchain object instance using txid_vout syntax
  @prop()
  event_location: ByteString;

  // once refunded the ticket may not longer be transferred or redeemed
  @prop()
  refund_location: ByteString;

  // once redeemed the txid_vin location of the unlocking scrypt that redeemed the toket
  // once redeemed the ticket may no longer be transferred
  @prop()
  redeem_location: ByteString;

  constructor(
    event_location: ByteString,
    price: BigInt,
    payee: PubKey,
    owner: PubKey
  ) {
    const refund_location = toByteString("");

    const redeem_location = toByteString("");

    super(
      event_location,
      price,
      payee,
      owner,
      refund_location,
      redeem_location
    );

    this.event_location = event_location;
    this.price = price;
    this.payee = payee;
    this.owner = owner;
    this.refund_location = refund_location;
    this.redeem_location = redeem_location;
  }

  // the owner of a ticket may transfer that ticket to anyone else
  @method()
  public transfer() {
    assert(false); // TODO: Implement
  }

  // before entering the event the owner of the ticket may refund the original satoshis
  @method()
  public refund() {
    assert(false); // TODO: Implement
  }

  // the owner of the ticket may redeem the ticket when they enter into the event room
  @method()
  public redeem() {
    assert(false); // TODO: Implement
  }

  // the payee of the contract may withdraw the funds only if already redeemed
  @method()
  public withdraw() {
    assert(false); // TODO: Implement
  }
}
