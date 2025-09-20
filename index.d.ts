/**
 * Before encrypting and decrypting values, a symmetric `CryptoKey` must be created.
 *
 * @param   {string}             value         - String key to be hashed. A 32-byte random string is recommended.
 * @param   {TextEncoder}        [textEncoder] - If you have an instance of a `TextEncoder`, you can reuse it.
 * @returns {Promise<CryptoKey>} A `CryptoKey` used to encrypt and decrypt strings.
 * @throws  {TypeError}          Thrown if `value` is invalid.
 */
export function createSymmetricCryptoKey(value: string, textEncoder?: TextEncoder): Promise<CryptoKey>;
/**
 * Encrypts a value with a `CryptoKey` previously generated with `createSymmetricCryptoKey`.
 *
 * @param   {string}          value         - Value to be encrypted.
 * @param   {CryptoKey}       key           - The symmetric key generated with `createSymmetricCryptoKey`.
 * @param   {TextEncoder}     [textEncoder] - If you have an instance of a `TextEncoder`, you can reuse it.
 * @returns {Promise<string>} The value encrypted and encoded as a Base64 string.
 * @throws  {DOMException}    Raised when:
 * - The provided key is not valid.
 * - The operation failed (e.g., AES-GCM plaintext longer than 2^39−256 bytes).
 */
export function encryptSymmetrically(value: string, key: CryptoKey, textEncoder?: TextEncoder): Promise<string>;
/**
 * Decrypts a value with a `CryptoKey` previously generated with `createSymmetricCryptoKey`.
 *
 * @param   {string}          value         - Encrypted value to be decrypted.
 * @param   {CryptoKey}       key           - The symmetric key used to encrypt the value.
 * @param   {TextDecoder}     [textDecoder] - If you have an instance of a `TextDecoder`, you can reuse it.
 * @returns {Promise<string>} The value decrypted.
 * @throws  {TypeError}       Thrown if `value` is not a string.
 * @throws  {SyntaxError}     Thrown if `value` contains characters outside Base64 alphabet.
 * @throws  {DOMException}    Raised when:
 * - The provided key is not valid.
 * - The operation failed.
 */
export function decryptSymmetrically(value: string, key: CryptoKey, textDecoder?: TextDecoder): Promise<string>;
