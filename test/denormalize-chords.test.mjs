import {expect} from '@esm-bundle/chai/esm/chai.js'
import { denormalize } from '../src/denormalize-chords.mjs'

describe('denormalize-chords', () => {
  it('should support simple case', () =>
    expect(denormalize('I IV V', 'C')).to.deep.equal(['C', 'F', 'G']))

  it('should support specifying a key', () =>
    expect(denormalize('I IV V', 'C')).to.deep.equal(['C', 'F', 'G']))

  it('should support specifying a key that is not the guessed one', () =>
    expect(denormalize(['IV', 'I'], 'G')).to.deep.equal(['C', 'G']))

  it('should correctly normalize Cops and Robbers', () =>
    expect(denormalize(['vi', 'iii', 'IV', 'IV'], 'C')).to.deep.equal([
      'Am',
      'Em',
      'F',
      'F'
    ]))

  it('handles major 7ths properly', () =>
    expect(denormalize(['I', 'Imaj7', 'IV', 'V'], 'C')).to.deep.equal([
      'C',
      'Cmaj7',
      'F',
      'G'
    ]))
})
