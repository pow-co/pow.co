import { fromASM, serialize } from '@RelayX/crypto/lib/bitcoin/script'
    import { serializeOutput } from '@RelayX/crypto/lib/bitcoin/transaction'
    import BufferWriter from '@RelayX/crypto/lib/bitcoin/BufferWriter'
    function makeB(text) {
      const pushdatas = ['19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut', text, 'text/plain', "utf8"]
      return pushdatas;
    }
    function makeMap(o) {
      const pushdatas = ['1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5', 'SET'];
      for (const k in o) {
        pushdatas.push(k)
        pushdatas.push(o[k])
      }
      return pushdatas
    }
    function createBitcom() {
      const b = makeB('Hello world');
      const map = makeMap({ type: 'post', app: 'relaytest' });
      return b.concat(['|'], map)
    }

    const te = new TextEncoder()
    function toHex(s) {
      return Array.from(te.encode(s)).map(c => c.toString(16)).join('')
    }

    document.addEventListener("DOMContentLoaded", function () {
      const payload = createBitcom().map(c => toHex(c))
      relayone.sign(`OP_FALSE OP_RETURN ${payload.join(' ')} 7c 313550636948473232534e4c514a584d6f5355615756693757537163376843667661 424954434f494e5f4543445341`).then(result => {
        console.log(result)
        if (!result.address) {
          throw new Error("Force refresh browser")
        }

        const final = `OP_FALSE OP_RETURN ${payload.join(' ')} 7c 313550636948473232534e4c514a584d6f5355615756693757537163376843667661 424954434f494e5f4543445341 ${toHex(result.address)} ${toHex(result.value)}`
        const bw = new BufferWriter()
        serializeOutput(bw, { satoshis: 0, lockingBytecode: serialize(fromASM(final)) })
        // relayone.send({
        //   outputs: [bw.concat().toString('hex')
        //   ]
        // })

      });
    });