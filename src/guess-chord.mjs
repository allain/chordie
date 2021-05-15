import { guessKey } from './guess-key.mjs'
import {DecisionTree} from './decision-tree.mjs'
import {normalizeChords as normalize} from './normalize-chords.mjs'
import {denormalize} from './denormalize-chords.mjs'

import { isString, firstN } from './utils.mjs'

export function guessChord(sequence, songs, precision) {
  const predictor = buildPredictor(songs, precision)
  return predictor(sequence)
}

function buildPredictor(songs, precision, minPrecision) {
  precision = precision || 10
  minPrecision = minPrecision || 3

  const decisionTree = new DecisionTree()

  // Build Decision Tree
  songs.forEach((songChords) => {
    if (typeof songChords === 'string') {
      songChords = songChords.split(/\s+/g)
    }
    songChords = normalize(songChords)

    do {
      var step = decisionTree
      var firstChords = firstN(songChords, precision)
      firstChords.forEach((c) => {
        step = step.step(c)
      })
      songChords.shift()
    } while (songChords.length > minPrecision)
  })

  return (sequence, key) => {
    if (isString(sequence)) {
      sequence = sequence.split(/[\s,]/g)
    }
    // clone sequence
    sequence = [].concat(sequence)

    key = key || guessKey(sequence)

    let predictions
    do {
      predictions = decisionTree.predictNext(normalize(sequence))
      if (predictions.length === 0) {
        sequence.shift() // Try shortening the sequence
      }
    } while (predictions.length === 0 && sequence.length > 0)

    predictions.forEach((prediction) => {
      prediction.name = denormalize(prediction.name, key)[0] || prediction.name
      delete prediction.count
    })

    return {
      seed: sequence,
      chords: predictions
    }
  }
}
