
import {
    MAP_PROTOCOL_ADDRESS,
  } from './constants';
  
  class BSocialUnlike {
    appName: string;
    txId: string;
    emoji: string;

    constructor(appName: string) {
      if (!appName) throw new Error('App name needs to be set');
      this.appName = appName;
      this.txId = '';
      this.emoji = '';
    }
  
    setTxId(txId: string) {
      this.txId = txId;
    }
  
    getOps(format: BufferEncoding = 'hex') {
      if (!this.txId) throw new Error('Like is not referencing a valid transaction');
  
      const ops = [];
      ops.push(MAP_PROTOCOL_ADDRESS); // MAP
      ops.push('SET');
      ops.push('app');
      ops.push(this.appName);
      ops.push('type');
      ops.push('unlike');
      ops.push('context');
      ops.push('tx');
      ops.push('tx');
      ops.push(this.txId);
  
      return ops.map((op) => {
        return Buffer.from(op).toString(format);
      });
    }
  }
  
  export default BSocialUnlike;