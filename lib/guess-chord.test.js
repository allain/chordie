const guess = require('./guess-chord')

describe('guess chord', function() {
  it('should support simple case', () =>
    expect(guess('A E A', ['A E A E'])).toEqual({
      seed: ['A', 'E', 'A'],
      chords: [{ name: 'E', probability: 1 }]
    }))

  it('supports prediction in normalized form', () =>
    expect(guess('I V I', ['A E A E'])).toEqual({
      seed: ['I', 'V', 'I'],
      chords: [{ name: 'V', probability: 1 }]
    }))

  it('should support change of key', () =>
    expect(guess('G D G', ['A E A E'])).toEqual({
      seed: ['G', 'D', 'G'],
      chords: [{ name: 'D', probability: 1 }]
    }))

  it('should support Maj7 chords', () =>
    expect(guess('C Cmaj7', ['C Cmaj7 G'])).toEqual({
      seed: ['C', 'Cmaj7'],
      chords: [{ name: 'G', probability: 1 }]
    }))

  it('handles diverging options', () => {
    expect(guess('C G C', ['A E A E', 'G D G C'])).toEqual({
      seed: ['C', 'G', 'C'],
      chords: [{ name: 'G', probability: 0.5 }, { name: 'F', probability: 0.5 }]
    })

    expect(guess('C G C', ['A E A E', 'G D G D', 'G D G C'])).toEqual({
      seed: ['C', 'G', 'C'],
      chords: [
        { name: 'G', probability: 0.6666666666666666 },
        { name: 'F', probability: 0.3333333333333333 }
      ]
    })
  })
})
