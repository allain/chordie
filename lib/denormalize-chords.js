const _ = require('lodash')

const offsets = { A: 5, B: 7, C: 8, D: 10, E: 0, F: 1, G: 3 }

const sharpNames = [
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
  'C',
  'C#',
  'D',
  'D#'
]

const offsetNames = [
  'I',
  'IIb',
  'II',
  'IIIb',
  'III',
  'IV',
  'Vb',
  'V',
  'VIb',
  'VI',
  'VIIb',
  'VII'
]

function denormalize(chords, key) {
  if (_.isString(chords)) {
    chords = chords.split(/\s+/)
  }

  if (key === 'I') return chords

  const keyOffset = offsets[key]
  if (keyOffset === undefined) {
    throw new Error('Invalid Key: ' + key)
  }

  const result = []
  chords.forEach(chord => {
    const match = /^([VI]+)([#b]?)(.*)$/gi.exec(chord)
    if (!match) throw new Error('Invalid Chord Name: ' + chord)

    let chordOffset
    _.forIn(offsetNames, (name, offset) => {
      if (name === match[1].toUpperCase() + match[2]) {
        chordOffset = parseInt(offset, 10)
        return false
      }
    })

    let chordName = sharpNames[(chordOffset + keyOffset + 12) % 12]
    if (match[1] === match[1].toLowerCase()) {
      chordName += 'm'
    }
    chordName += match[3] || ''

    result.push(chordName)
  })

  return result
}

module.exports = denormalize
