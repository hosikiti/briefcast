import {
    ENCRYPT_KEY
} from "$env/static/private";
import crypto from 'crypto'

const algorithm = 'aes-256-cbc';
const delimiter = '$';

// encrypt string with aes-256
export function encryptString(input: string): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(algorithm, ENCRYPT_KEY, iv)
    const result = cipher.update(input, 'utf-8', 'base64') + cipher.final('base64')
    return iv.toString("base64") + delimiter + result;
}

// decrypt encrypted string with aes-256
export function decryptString(input: string): string {
    const [iv, encrypted] = input.split(delimiter)
    const decipher = crypto.createDecipheriv(algorithm, ENCRYPT_KEY, Buffer.from(iv, 'base64'))
    return decipher.update(encrypted, 'base64', 'utf-8') + decipher.final('utf-8')
}