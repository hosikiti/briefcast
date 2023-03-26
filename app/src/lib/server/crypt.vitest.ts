import { expect, test } from 'vitest'
import { encryptString, decryptString } from './crypt'

test('encryptString', () => {
    const encrypted = encryptString("hoge")
    const decripted = decryptString(encrypted)
    expect(decripted).toBe("hoge")
})