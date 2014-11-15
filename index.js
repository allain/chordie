var _ = require('lodash');

var DecisionTree = require('./lib/decision-tree');

function guessKey(chords) {  
  var ratings = rateKeys(chords);
  return ratings.length ? ratings[0].key : null;
}

var keyFingerprints = {
  'C': ['C', 'G', 'F', 'Am', 'Dm', 'Em', 'Bdim'],
  'D': ['D', 'A', 'G', 'Bm', 'Em', 'F#m', 'C#dim'],
  'E': ['E', 'B', 'A', 'C#m', 'F#m', 'G#m', 'D#dim'],
  'F': ['F', 'C', 'A#', 'Dm', 'Gm', 'Am', 'Edim'],
  'G': ['G', 'D', 'C', 'Em', 'Am', 'Bm', 'F#dim'],
  'A': ['A', 'E', 'D', 'F#m', 'Bm', 'C#m', 'G#dim'],
  'B': ['B', 'F#', 'E', 'Em', 'C#m', 'D#m', 'A#dim'],
  'I': ['I', 'V', 'IV', 'vi', 'iii', 'ii', 'VIIdim']
};

function rateKeys(chords) {
  var sample = _.first(cleanupChords(chords), 20);
  
  if (!Array.isArray(sample) || sample.length === 0) {
    return [{
        key: 'I',
        score: 100
    }];
  }

  var scores = _.map(keyFingerprints, function(fingerprint, key) {
    return {
      key: key,
      score: rateKey(sample, fingerprint)
    };
  }).filter(function(c) {
    return c.score > 0;
  });

  scores.sort(function(a, b) {
    if (a.score === b.score) {
      var indexA = findFirst(sample, keyFingerprints[a.key]);
      var indexB = findFirst(sample, keyFingerprints[b.key]);
      return indexA - indexB;
    } else {
      return b.score - a.score;
    }
  });
 
  return scores;
}

function rateKey(sample, keyChords) {
  var keyScore = 0;

  sample.forEach(function(c) {
    var matchIndex = keyChords.indexOf(c);
    if (matchIndex >= 0) {
      // Earlier in the chord fingerprint is found, the  more important it is to that key
      keyScore += (keyChords.length - matchIndex);
    } else {
      keyScore --; 
    }
  });

  if (keyScore > 0) {
    // Add some weight for how early in the song a chord from the key appears
    keyScore += (sample.length - findFirst(sample, keyChords));
  }

  return keyScore;
}

function cleanupChords(chords) {
  if (_.isString(chords)) {
    chords = chords.split(/\s+/);
  }
  
  return chords.filter(function(c) {
    return !!c;
  }).map(function(chord) {
    chord = chord.replace('maj7', '');
    chord = chord.replace('M7', '');
    return chord.replace(/^([A-G][#b]?m?).*$/g, '$1');
  });
}

function findFirst(sample, chords) {
  var first = -1;

  chords.forEach(function(chord) {
    var pos = sample.indexOf(chord);
    if (first === -1 && pos >= 0) {
      first = pos;
      return false;
    }
  });

  return first;
}

var offsets = {'A': 5, 'B': 7, 'C': 8, 'D': 10, 'E': 0, 'F': 1, 'G': 3};

function noteOffset(note) {
  var match = /^([A-G])([#b]?)/.exec(note);
  if (!match)
    return -1;
  
  var letter = match[1];
  var bend = match[2];

  var offset = offsets[letter];

  if (bend === '#') {
    offset ++;
  } else if (bend === 'b') {
    offset --;
  }

  return offset;
}

var offsetNames = {
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
};

function normalize(chords, key) {
  key = key || guessKey(chords);
  if (_.isString(chords)) {
    chords = chords.split(/\s+/);
  }

  chords = chords.filter(function(c) { return !!c; });

  if (chords.length === 0) {
    return chords;
  }

  if (key === 'I') {
    return chords;
  }

  var keyOffset = noteOffset(key);
  var normalized = [];

  chords.forEach(function(c) {
    var chordOffset = noteOffset(c);    

    var chordDelta = (12 + chordOffset - keyOffset) % 12;
    var match = /^([A-G])([#b]?)(maj|dom|m)?(.*)$/g.exec(c);
    var quality = match[3];

    var chordLabel = offsetNames[chordDelta];
    if (quality === 'm') {
      chordLabel = chordLabel.toLowerCase();
    } else if (quality === 'dom') {
      chordLabel += 'dom';
    } else if (quality === 'maj') {
      chordLabel += 'maj';
    }

    chordLabel += match[4];

    normalized.push(chordLabel);
  });

  return normalized;
}

var sharpNames = [
  'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'
];

function denormalize(chords, key) {
  if (_.isString(chords)) {
    chords = chords.split(/\s+/);
  }  
  
  if (key === 'I') {
    return chords;
  }

  var keyOffset = offsets[key];
  if (keyOffset === undefined) {
    throw new Error('Invalid Key: ' + key); 
  }

  var result = [];
  chords.forEach(function(chord) {
    var match = /^([VI]+)([#b]?)(.*)$/ig.exec(chord);        
    if (!match) {
      throw new Error('Invalid Chord Name: ' + chord);
    }
    
    var chordOffset;
    _.forIn(offsetNames, function(name, offset) {
      if (name === match[1].toUpperCase() + match[2]) {
        chordOffset = parseInt(offset, 10);
        return false;
      }
    });       
    
    var chordName = sharpNames[(chordOffset + keyOffset + 12) % 12];
    if (match[1] === match[1].toLowerCase()) {
      chordName += 'm';
    }
    chordName += (match[3] || '');    
    result.push(chordName);
  });
  
  return result;
}

function buildPredictor(songs, precision) {
  precision = precision || 10;

  var decisionTree = new DecisionTree();

  // Build Decision Tree
  songs.forEach(function(songChords) {
    if (_.isString(songChords)) {
      songChords = songChords.split(/\s+/g);
    }
    songChords = normalize(songChords);

    do {
      var step = decisionTree;
      var firstChords = _.first(songChords, precision);
      firstChords.forEach(function(c) {
        step = step.step(c);
      });
      songChords.shift();
    } while (songChords.length > 3);
  });

  return function(sequence, key) {
    if (_.isString(sequence)) {
      sequence = sequence.split(/[\s,]/g);
    }
    // clone sequence
    sequence = [].concat(sequence);    
    
    key = key || guessKey(sequence);   
                    
    var predictions;
    do {      
      predictions = decisionTree.predictNext(normalize(sequence));      
      if (predictions.length === 0) {
        sequence.shift(); // Try shortening the sequence
      }
    } while (predictions.length === 0 && sequence.length > 0);
    
    predictions.forEach(function(prediction) {
      prediction.name = denormalize(prediction.name, key)[0] || prediction.name;      
      delete prediction.count;
    });        
    
    //predictions.effectiveProgression = sequence;

    return {
      seed: sequence,
      chords: predictions
    };
  };
}

function predictChord(sequence, songs, precision) {
  return buildPredictor(songs, precision)(sequence);
}

module.exports = {
  normalize: normalize,
  denormalize: denormalize,
  guessKey: guessKey,
  buildPredictor: buildPredictor,
  predictChord: predictChord
};
