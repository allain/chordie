const _ = require('lodash')
const guessKey = require('./guess-key')
const DecisionTree = require('./decision-tree')
const normalize = require('./normalize-chords')
const denormalize = require('./denormalize-chords')

function guessChord(sequence, songs, precision) {
  return buildPredictor(songs, precision)(sequence)
}

function buildPredictor(songs, precision, minPrecision) {
  precision = precision || 10
  minPrecision = minPrecision || 3

  const decisionTree = new DecisionTree()

  // Build Decision Tree
  songs.forEach(songChords => {
    if (_.isString(songChords)) {
      songChords = songChords.split(/\s+/g)
    }
    songChords = normalize(songChords)

    do {
      var step = decisionTree
      var firstChords = _.first(songChords, precision)
      firstChords.forEach(c => {
        step = step.step(c)
      })
      songChords.shift()
    } while (songChords.length > minPrecision)
  })

  return (sequence, key) => {
    if (_.isString(sequence)) {
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

    predictions.forEach(prediction => {
      prediction.name = denormalize(prediction.name, key)[0] || prediction.name
      delete prediction.count
    })

    return {
      seed: sequence,
      chords: predictions
    }
  }
}

module.exports = guessChord
