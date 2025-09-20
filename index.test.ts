import { expect, test } from "bun:test"
import { createSymmetricCryptoKey, encryptSymmetrically, decryptSymmetrically } from "."


function randomString(length = 32) {
  // A Base64 character is 6 bits: 6 bits / 8 bits = 0.75
  return crypto.getRandomValues(new Uint8Array(length * .75)).toBase64()
}


test("Generate a random symmetric CryptoKey", async() => {
  const key = await createSymmetricCryptoKey(randomString())
  expect(key).toBeDefined()
})


test("Encrypt a random value", async() => {
  const key = await createSymmetricCryptoKey(randomString())
  expect(await encryptSymmetrically(randomString(), key)).toBeString()
})


test("Decrypt a random value", async() => {
  const symCryptoKey = await createSymmetricCryptoKey(randomString())
  const randomValue = randomString()
  const encrypted = await encryptSymmetrically(randomValue, symCryptoKey)
  const decrypted = await decryptSymmetrically(encrypted, symCryptoKey)
  expect(randomValue === decrypted).toBeTrue()
})