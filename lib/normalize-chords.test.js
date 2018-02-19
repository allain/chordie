const normalize = require('./normalize-chords')

describe('normalize-chords', () => {
  it('should support simple case', () =>
    expect(normalize('C F G')).toEqual(['I', 'IV', 'V']))

  it('should support specifying a key', () =>
    expect(normalize('C F G', 'C')).toEqual(['I', 'IV', 'V']))

  it('should support specifying a key that is not the guessed one', () =>
    expect(normalize('C G', 'G')).toEqual(['IV', 'I']))

  it('should correctly normalize Cops and Robbers', () =>
    expect(normalize('Am Em F F')).toEqual(['vi', 'iii', 'IV', 'IV']))

  it('handles major 7ths properly', () =>
    expect(normalize('C Cmaj7 F G')).toEqual(['I', 'Imaj7', 'IV', 'V']))
})
