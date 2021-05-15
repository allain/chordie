import { expect } from '@esm-bundle/chai/esm/chai.js'
import { DecisionTree } from '../src/DecisionTree.mjs'

describe('DecisionTree', () => {
  it('create can be created', () => {
    const dt = new DecisionTree()
    expect(dt).to.be.instanceOf(DecisionTree)
  })

  it('create add chord steps', () => {
    const dt = new DecisionTree()
    dt.step('A').step('B')
    expect(dt.predictNext(['A'])).to.deep.equal([
      {
        count: 1,
        name: 'B',
        probability: 1
      }
    ])
  })
})
