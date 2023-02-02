
import { HDPrivateKey } from 'bsv'

import BSocial from 'bsocial';

import { BAP } from 'bitcoin-bap'

export function signOpReturn(hexArrayOps: string[]) {

  const hdPrivateKey = new HDPrivateKey()

  //const HDPrivateKey = 'xprv...';
  const bap = new BAP(hdPrivateKey);

  // Create a new identity
  const newId = bap.newId();
  // set the name of the ID
  newId.name = '';
  // set a description for this ID
  newId.description = '';
  // set identity attributes
  newId.addAttribute('name', '');
  newId.addAttribute('email', '');

  // export the identities for storage
  const encryptedExport = bap.exportIds();

  const decrypted = JSON.parse(bap.decrypt(encryptedExport))

  const identity = bap.getId(decrypted.ids[0].identityKey);

  // signOpReturnWithAIP expects and returns hex values
  const signedOpReturn = identity.signOpReturnWithAIP(hexArrayOps);

  return signedOpReturn.map((item: any) => Buffer.from(item, 'hex').toString('utf8'))

}

export interface NewLike {
  app: string;
  txid: string;
  emoji?: string;
}

import Unlike from './bsocial/unlike'

export function like(newLike: NewLike) {

  const bSocial = new BSocial(newLike.app);

  const like = bSocial.like()

  like.setTxId(newLike.txid)

  if (newLike.emoji) {

    like.setEmoji(newLike.emoji)

  }

  return signOpReturn(like.getOps())

}

export interface NewReply {
  app: string;
  txid: string;
  comment: string;
}

export function newReply(reply: NewReply) {

  const bSocial = new BSocial(reply.app);

  const post = bSocial.post();

  post.setTxId(reply.txid)

  post.addText(reply.comment);

  return signOpReturn(post.getOps())

}

interface NewUnlike {
  app: string;
  txid: string;
}

export function unlike(newUnlike: NewUnlike) {

  const unlike = new Unlike(newUnlike.app)

  unlike.setTxId(newUnlike.txid)

  return signOpReturn(unlike.getOps())

}

export default function(app: string, content: string) {

  const hdPrivateKey = new HDPrivateKey()

  //const HDPrivateKey = 'xprv...';
  const bap = new BAP(hdPrivateKey);

  // Create a new identity
  const newId = bap.newId();
  // set the name of the ID
  newId.name = '';
  // set a description for this ID
  newId.description = '';
  // set identity attributes
  newId.addAttribute('name', '');
  newId.addAttribute('email', '');

  // export the identities for storage
  const encryptedExport = bap.exportIds();

  const decrypted = JSON.parse(bap.decrypt(encryptedExport))

  const identity = bap.getId(decrypted.ids[0].identityKey);

  const bSocial = new BSocial(app);

  const post = bSocial.post();

  post.addText(content);

  const hexArrayOps = post.getOps();

  // signOpReturnWithAIP expects and returns hex values
  const signedOpReturn = identity.signOpReturnWithAIP(hexArrayOps);

  return signedOpReturn.map((item: any) => Buffer.from(item, 'hex').toString('utf8'))

}
