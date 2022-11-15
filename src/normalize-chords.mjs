import { guessKey } from './guess-key.mjs'

const offsets = { A: 5, B: 7, C: 8, D: 10, E: 0, F: 1, G: 3 }

const offsetNames = {
  0: 'I',
  1: 'IIb',
  2: 'II',
  3: 'IIIb',
  4: 'III',
  5: 'IV',
  6: 'Vb',
  7: 'V',
  8: 'VIb',
  9: 'VI',
  10: 'VIIb',
  11: 'VII'
}

function noteOffset(note) {
  const match = /^([A-Ga-g])([#b]?)/.exec(note)
  if (!match) return -1

  const letter = match[1].toUpperCase()
  const bend = match[2]

  let offset = offsets[letter]

  if (bend === '#') {
    offset++
  } else if (bend === 'b') {
    offset--
  }

  return offset
}

export function normalizeChords(chords, key) {
  key = key || guessKey(chords)
  if (typeof chords === 'string') {
    chords = chords.split(/\s+/)
  }

  chords = chords.filter((c) => !!c)

  if (chords.length === 0 || key === 'I') return chords

  const keyOffset = noteOffset(key)
  const normalized = []

  chords.forEach((c) => {
    const chordOffset = noteOffset(c)

    const chordDelta = (12 + chordOffset - keyOffset) % 12
    const match = /^([A-Ga-g])([#b]?)(maj|dom|m)?(.*)$/g.exec(c)
    if (!match) {
      return
    }

    var quality = match[3]

    var chordLabel = offsetNames[chordDelta]
    if (quality === 'm') {
      chordLabel = chordLabel.toLowerCase()
    } else if (quality === 'dom') {
      chordLabel += 'dom'
    } else if (quality === 'maj') {
      chordLabel += 'maj'
    }

    chordLabel += match[4]

    normalized.push(chordLabel)
  })

  return normalized
}
