import { expect, test } from 'vitest'
import { isEnglish } from './util'

test('isEnglish', () => {
    expect(isEnglish("en-US")).toBe(true)
    expect(isEnglish("en-UK")).toBe(true)
    expect(isEnglish("ja-JP")).toBe(false)
})