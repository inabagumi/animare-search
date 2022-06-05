import { Temporal } from '@js-temporal/polyfill'
import { convertToDateArray, max, min } from '../date'

describe('convertToDateArray', () => {
  it('should returns the datetime divided into an array given the datetime.', () => {
    const dateTime = Temporal.ZonedDateTime.from({
      day: 3,
      month: 3,
      timeZone: 'Asia/Tokyo',
      year: 1999
    })
    const result = convertToDateArray(dateTime)

    expect(result).toStrictEqual([1999, 3, 3, 0, 0])
  })
})

describe('max', () => {
  it('should returns the newest datetime given multiple datetimes.', () => {
    const dateTimeA = Temporal.ZonedDateTime.from({
      day: 3,
      month: 3,
      timeZone: 'Asia/Tokyo',
      year: 1999
    })
    const dateTimeB = Temporal.ZonedDateTime.from({
      day: 9,
      month: 6,
      timeZone: 'Asia/Tokyo',
      year: 2018
    })
    const result = max(dateTimeA, dateTimeB)

    expect(result).toBe(dateTimeB)
  })
})

describe('min', () => {
  it('should returns the oldest datetime given multiple datetimes.', () => {
    const dateTimeA = Temporal.ZonedDateTime.from({
      day: 3,
      month: 3,
      timeZone: 'Asia/Tokyo',
      year: 1999
    })
    const dateTimeB = Temporal.ZonedDateTime.from({
      day: 9,
      month: 6,
      timeZone: 'Asia/Tokyo',
      year: 2018
    })
    const result = min(dateTimeA, dateTimeB)

    expect(result).toBe(dateTimeA)
  })
})
