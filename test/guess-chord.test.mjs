import { expect } from '@esm-bundle/chai/esm/chai.js'

import { guessChord } from '../src/guess-chord.mjs'

describe('guess chord', function () {
  it('should support simple case', () =>
    expect(guessChord(['A', 'E', 'A'], [['A', 'E', 'A', 'E']])).to.deep.equal({
      seed: ['A', 'E', 'A'],
      chords: [{ name: 'E', probability: 1 }]
    }))

  it('supports prediction in normalized form', () =>
    expect(guessChord(['I', 'V', 'I'], [['A', 'E', 'A', 'E']])).to.deep.equal({
      seed: ['I', 'V', 'I'],
      chords: [{ name: 'V', probability: 1 }]
    }))

  it('should support change of key', () =>
    expect(guessChord(['G', 'D', 'G'], [['A', 'E', 'A', 'E']])).to.deep.equal({
      seed: ['G', 'D', 'G'],
      chords: [{ name: 'D', probability: 1 }]
    }))

  it('should support Maj7 chords', () =>
    expect(guessChord(['C', 'Cmaj7'], [['C', 'Cmaj7', 'G']])).to.deep.equal({
      seed: ['C', 'Cmaj7'],
      chords: [{ name: 'G', probability: 1 }]
    }))

  it('handles diverging options', () => {
    expect(
      guessChord(
        ['C', 'G', 'C'],
        [
          ['A', 'E', 'A', 'E'],
          ['G', 'D', 'G', 'C']
        ]
      )
    ).to.deep.equal({
      seed: ['C', 'G', 'C'],
      chords: [
        { name: 'G', probability: 0.5 },
        { name: 'F', probability: 0.5 }
      ]
    })

    expect(
      guessChord(
        ['C', 'G', 'C'],
        [
          ['A', 'E', 'A', 'E'],
          ['G', 'D', 'G', 'D'],
          ['G', 'D', 'G', 'C']
        ]
      )
    ).to.deep.equal({
      seed: ['C', 'G', 'C'],
      chords: [
        { name: 'G', probability: 0.6666666666666666 },
        { name: 'F', probability: 0.3333333333333333 }
      ]
    })
  })
})
