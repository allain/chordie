import {expect} from '@esm-bundle/chai/esm/chai.js'

import {normalizeChords as normalize} from '../src/normalize-chords.mjs'


describe('normalize-chords', () => {
  it('should support simple case', () =>
    expect(normalize(['C', 'F', 'G'])).to.deep.equal(['I', 'IV', 'V']))

  it('should support specifying a key', () =>
    expect(normalize(['C', 'F','G'], 'C')).to.deep.equal(['I', 'IV', 'V']))

  it('should support specifying a key that is not the guessed one', () =>
    expect(normalize(['C','G'], 'G')).to.deep.equal(['IV', 'I']))

  it('should correctly normalize Cops and Robbers', () =>
    expect(normalize(['Am','Em', 'F','F'])).to.deep.equal(['vi', 'iii', 'IV', 'IV']))

  it('handles major 7ths properly', () =>
    expect(normalize(['C','Cmaj7','F','G'])).to.deep.equal(['I', 'Imaj7', 'IV', 'V']))
})
