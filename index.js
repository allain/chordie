const guessKey = require('./src/guess-key.mjs')
const guessChord = require('./src/guess-chord.mjs')
const normalize = require('./src/normalize-chords.mjs')
const denormalize = require('./src/denormalize-chords.mjs')

module.exports = {
  normalize: normalize,
  denormalize: denormalize,
  guessKey: guessKey,
  guessChord: guessChord
}
