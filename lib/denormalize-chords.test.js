const denormalize = require('./denormalize-chords')

describe('denormalize-chords', () => {
  it('should support simple case', () =>
    expect(denormalize('I IV V', 'C')).toEqual(['C', 'F', 'G']))

  it('should support specifying a key', () =>
    expect(denormalize('I IV V', 'C')).toEqual(['C', 'F', 'G']))

  it('should support specifying a key that is not the guessed one', () =>
    expect(denormalize(['IV', 'I'], 'G')).toEqual(['C', 'G']))

  it('should correctly normalize Cops and Robbers', () =>
    expect(denormalize(['vi', 'iii', 'IV', 'IV'], 'C')).toEqual([
      'Am',
      'Em',
      'F',
      'F'
    ]))

  it('handles major 7ths properly', () =>
    expect(denormalize(['I', 'Imaj7', 'IV', 'V'], 'C')).toEqual([
      'C',
      'Cmaj7',
      'F',
      'G'
    ]))
})
