import { expect, test } from 'vitest'
import { formatTime, isEnglish } from './util'

test('isEnglish', () => {
    expect(isEnglish("en-US")).toBe(true)
    expect(isEnglish("en-UK")).toBe(true)
    expect(isEnglish("ja-JP")).toBe(false)
})

test('formatTime', () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(9)).toBe("0:09");
    expect(formatTime(60)).toBe("1:00");
    expect(formatTime(600)).toBe("10:00");
    expect(formatTime(3600)).toBe("1:00:00");
    expect(formatTime(7859)).toBe("2:10:59");
})