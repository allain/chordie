import { expect } from '@esm-bundle/chai/esm/chai.js'

import { guessKey } from '../src/guess-key.mjs'

describe('guess-key', function () {
  it('should accept an array of chord names', () =>
    expect(guessKey(['C', 'F', 'G', 'Am', 'Em'])).to.deep.equal('C'))

  it('should prefer the first chords it encounters when guessing', () => {
    expect(guessKey(['C','F','G','D'])).to.deep.equal('C')
    expect(guessKey(['G','F','C','D'])).to.deep.equal('G')
  })

  it('should find in simple cases', () =>
    expect(guessKey(['A', 'E', 'A', 'E'])).to.deep.equal('A'))

  it('should find correct key for Cops and Robbers', () =>
    expect(guessKey(['Am', 'Em', 'F', 'F'])).to.deep.equal('C'))

  it('should find normalized key', () =>
    expect(guessKey(['ii', 'V', 'I', 'iii'])).to.deep.equal('I'))

  it('should return I when no chords given', () => {
    expect(guessKey([])).to.deep.equal('I')
  })

  it('should guess key from major 7 chord', () =>
    expect(guessKey(['Cmaj7'])).to.deep.equal('C'))
})
