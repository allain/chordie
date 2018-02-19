const guessKey = require('./lib/guess-key')
const guessChord = require('./lib/guess-chord')
const normalize = require('./lib/normalize-chords')
const denormalize = require('./lib/denormalize-chords')

module.exports = {
  normalize: normalize,
  denormalize: denormalize,
  guessKey: guessKey,
  guessChord: guessChord
}
