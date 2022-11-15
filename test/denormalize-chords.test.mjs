import { expect } from 'chai'
import { denormalizeChords } from '../src/denormalize-chords.mjs'

describe('denormalize-chords', () => {
  it('should support simple case', () =>
    expect(denormalizeChords(['I', 'IV', 'V'], 'C')).to.deep.equal([
      'C',
      'F',
      'G'
    ]))

  it('should support specifying a key', () =>
    expect(denormalizeChords(['I', 'IV', 'V'], 'C')).to.deep.equal([
      'C',
      'F',
      'G'
    ]))

  it('should support specifying a key that is not the guessed one', () =>
    expect(denormalizeChords(['IV', 'I'], 'G')).to.deep.equal(['C', 'G']))

  it('should correctly normalize Cops and Robbers', () =>
    expect(denormalizeChords(['vi', 'iii', 'IV', 'IV'], 'C')).to.deep.equal([
      'Am',
      'Em',
      'F',
      'F'
    ]))

  it('handles major 7ths properly', () =>
    expect(denormalizeChords(['I', 'Imaj7', 'IV', 'V'], 'C')).to.deep.equal([
      'C',
      'Cmaj7',
      'F',
      'G'
    ]))
})
