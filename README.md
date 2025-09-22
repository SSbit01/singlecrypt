# SingleCrypt

> [!WARNING]  
> This package uses [`Uint8Array.prototype.toBase64()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64) and [`Uint8Array.fromBase64()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64), which, as of September 2025, are only supported by the latest versions of browsers and [Bun](https://bun.com/). See [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64#browser_compatibility) for compatibility.

A simple, secure, and fast symmetric encryption library that makes use of [AES-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) and modern platform features. It leverages the native [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API), so it works both in browsers and JavaScript runtimes.

## Why AES-GCM?

AES-GCM is extremely fast on modern CPUs, which have dedicated hardware acceleration ([AES-NI](https://en.wikipedia.org/wiki/AES_instruction_set)), in addition to being highly secure and even quantum-resistant (AES-256-GCM).

## Installation

Using `bun`:

```shell
bun add singlecrypt-text
```

## Methods

#### `createSymmetricKeyWithText`

Creates a symmetric `CryptoKey` object to be used in the following methods. This method also converts your value key to a SHA-256 hash. It takes two parameters:

1. A string key to be hashed. A 32-byte random string is recommended.
2. A `TextEncoder` instance, if you want to reuse it (optional).

Returns a `Promise<CryptoKey>` containing a SHA-256 hash used to encrypt and decrypt strings.

A `TypeError` may be thrown if there are problems with the string key.

### `encryptSymmetricallyText`

Encrypts a value with a symmetric `CryptoKey` previously generated. It takes three parameters:

1. A string value to be encrypted.
2. The symmetric key generated with `createSymmetricKeyWithText`.
3. A `TextEncoder` instance, if you want to reuse it (optional).

Returns a `Promise<string>` containing the encrypted value.

A `DOMException` may be thrown if the key is invalid or if the operation failed (e.g., AES-GCM plaintext longer than 2^39−256 bytes).

### `decryptSymmetricallyText`

Decrypts a value with a symmetric `CryptoKey` previously generated. It takes three parameters:

1. A string value to be decrypted.
2. The symmetric key generated with `createSymmetricKeyWithText`.
3. A `TextDecoder` instance, if you want to reuse it (optional).

Returns a `Promise<string>` containing the decrypted value.

The following errors may be thrown:

- `TypeError`: if the first parameter is not a string.
- `SyntaxError`: if the first parameter contains characters outside the Base64 alphabet.
- `DOMException`: if the key is invalid or if the operation failed.

## Example

Let's say you have a user ID in a server and you want the server to encrypt and store the ID in a cookie.

`./lib/user/crypto.ts`

```typescript
import {
  createSymmetricKeyWithText,
  encryptSymmetricallyText,
  decryptSymmetricallyText
} from "singlecrypt";


const userCryptoKey = await createSymmetricKeyWithText(
  process.env.KEY_USER
);


export async function encryptUserId(value: string) {
  return await encryptSymmetricallyText(
    value,
    userCryptoKey
  );
}

export async function decryptUserId(value: string) {
  return await decryptSymmetricallyText(
    value,
    userCryptoKey
  );
}
```

Or you can reuse `TextEncoder` and `TextDecoder` instances for slightly better performance:

```typescript
import {
  createSymmetricKeyWithText,
  encryptSymmetricallyText,
  decryptSymmetricallyText
} from "singlecrypt";


const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const userCryptoKey = await createSymmetricKeyWithText(
  process.env.KEY_USER,
  textEncoder
);


export async function encryptUserId(value: string) {
  return await encryptSymmetricallyText(
    value,
    userCryptoKey,
    textEncoder
  );
}

export async function decryptUserId(value: string) {
  return await decryptSymmetricallyText(
    value,
    userCryptoKey,
    textDecoder
  );
}
```

And now you can easily encrypt and decrypt user IDs:

```typescript
// ...
import { encryptUserId, decryptUserId } from "./lib/user/crypto";
// ...

const userId = await getUserIdFromDatabase();
const encryptedId = await encryptUserId(userId);  // Now you can safely store it in an HttpOnly cookie
// ...
const decryptedId = await decryptUserId(encryptedId);
// ...
console.log(userId === decryptedId);  // True
// ...
```

---

Created by [SSbit01](https://ssbit01.github.io/).