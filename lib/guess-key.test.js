const guessKey = require('./guess-key')

describe('guess-key', function() {
  it('should accept an array of chord names', () =>
    expect(guessKey(['C', 'F', 'G', 'Am', 'Em'])).toEqual('C'))

  it('should accept a string with white space separated chords', () =>
    expect(guessKey('C F G Am Em')).toEqual('C'))

  it('should prefer the first chords it encounters when guessing', () => {
    expect(guessKey('C F G D')).toEqual('C')
    expect(guessKey('G F C D')).toEqual('G')
  })

  it('should find in simple cases', () =>
    expect(guessKey('A E A E')).toEqual('A'))

  it('should find correct key for Cops and Robbers', () =>
    expect(guessKey('Am Em F F')).toEqual('C'))

  it('should find normalized key', () =>
    expect(guessKey('ii V I iii')).toEqual('I'))

  it('should return I when no chords given', () => {
    expect(guessKey('')).toEqual('I')
    expect(guessKey([])).toEqual('I')
  })

  it('should guess key from major 7 chord', () =>
    expect(guessKey('Cmaj7')).toEqual('C'))
})
