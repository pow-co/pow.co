export function buf2hex(buffer: ArrayBuffer) {
return Array.from(new Uint8Array(buffer))
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}