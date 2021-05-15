import { firstN } from './utils.mjs'

const keyFingerprints = {
  C: ['C', 'G', 'F', 'Am', 'Dm', 'Em', 'Bdim'],
  D: ['D', 'A', 'G', 'Bm', 'Em', 'F#m', 'C#dim'],
  E: ['E', 'B', 'A', 'C#m', 'F#m', 'G#m', 'D#dim'],
  F: ['F', 'C', 'A#', 'Dm', 'Gm', 'Am', 'Edim'],
  G: ['G', 'D', 'C', 'Em', 'Am', 'Bm', 'F#dim'],
  A: ['A', 'E', 'D', 'F#m', 'Bm', 'C#m', 'G#dim'],
  B: ['B', 'F#', 'E', 'Em', 'C#m', 'D#m', 'A#dim'],
  I: ['I', 'V', 'IV', 'vi', 'iii', 'ii', 'VIIdim']
}

const DEFAULT_RATINGS = [
  {
    key: 'I',
    score: 100
  }
]

export function guessKey(chords) {
  return (rateKeys(chords)[0] || { key: null }).key
}

function cleanupChords(chords) {
  return chords.filter(Boolean).map((c) =>
    c
      .replace('maj7', '')
      .replace('M7', '')
      .replace(/^([A-G][#b]?m?).*$/g, '$1')
  )
}

function findFirst(sample, chords) {
  return chords.reduce(
    (result, c) => (result === -1 ? sample.indexOf(c) : result),
    -1
  )
}

function rateKeys(chords) {
  const sample = firstN(cleanupChords(chords), 20)

  if (sample.length === 0) return DEFAULT_RATINGS

  return Object.entries(keyFingerprints)
    .map(([key, fingerprint]) => ({
      key: key,
      score: rateKey(sample, fingerprint)
    }))
    .filter((c) => c.score > 0)
    .sort((a, b) =>
      a.score === b.score
        ? findFirst(sample, keyFingerprints[a.key]) -
          findFirst(sample, keyFingerprints[b.key])
        : b.score - a.score
    )
}

function rateKey(sample, keyChords) {
  let keyScore = sum(
    sample.map((c) => {
      const cIndex = keyChords.indexOf(c)
      return cIndex === -1 ? -1 : keyChords.length - cIndex
    })
  )

  // Add some weight for how early in the song a chord from the key appears
  return (
    keyScore + (keyScore > 0 && sample.length - findFirst(sample, keyChords))
  )
}

function sum(arr) {
  return arr.reduce((total, x) => total + x, 0)
}
