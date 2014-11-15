var assert = require('chai').assert,
    chordie = require('..');

describe('chordie', function() {
  describe('guessKey()', function() {
    it('should accept an array of chord names', function() {
      assert.equal('C', chordie.guessKey(['C', 'F',  'G', 'Am', 'Em']));  
    });

    it('should accept a string with white space separated chords', function() {
      assert.equal('C', chordie.guessKey('C F G Am Em'));
    });
    
    it('should prefer the first chords it encounters when guessing', function() {
      assert.equal('C', chordie.guessKey('C F G D'));                 
      assert.equal('G', chordie.guessKey('G F C D'));
    });
    
    it('should find in simple cases', function() {
      assert.equal('A', chordie.guessKey('A E A E'));
    });
    
    it('should find normalized key', function() {
      assert.equal('I', chordie.guessKey('ii V I iii'));
    });
    
    it('should return I when no chords given', function() {
      assert.equal('I', chordie.guessKey(''));
      assert.equal('I', chordie.guessKey([]));
    });
    
    it('should guess key from major 7 chord', function() {
      assert.equal('C', chordie.guessKey('Cmaj7'));
    });
  });
  
  describe('normalizeChords', function() {
    it('should support simple case', function() {
      assert.deepEqual(['I', 'IV', 'V'], chordie.normalize('C F G'));
    });
    
    it('should support specifying a key', function() {
      assert.deepEqual(['I', 'IV', 'V'], chordie.normalize('C F G', 'C'));
    });
    
    it('should support specifying a key that is not the guessed one', function() {
      assert.equal('C', chordie.guessKey('C G'));
      assert.deepEqual(['IV', 'I'], chordie.normalize('C G', 'G'));
    });
    
    it('should correctly normalize Cops and Robbers', function() {
      assert.deepEqual(['vi', 'iii', 'IV', 'IV'], chordie.normalize('Am Em F F'));
    });
    
    it('handles major 7ths properly', function() {
      assert.deepEqual(['I', 'Imaj7', 'IV', 'V'], chordie.normalize('C Cmaj7 F G'));
    });
  });
  
  describe('guess chord', function() {
    it('should support simple case', function() {
      assert.deepEqual(chordie.predictChord('A E A', ['A E A E']), 
        {seed: ['A', 'E', 'A'], chords: [{name: 'E', probability: 1}]}
      );
    });
    
    it('supports prediction in normalized form', function() {
     assert.deepEqual(
      chordie.predictChord('I V I', ['A E A E']),
      {seed: ['I', 'V', 'I'], chords: [ {name: 'V', probability: 1}]}
     );
    });
    
    it('should support change of key', function() {
      assert.deepEqual(
        chordie.predictChord('G D G', ['A E A E']),
        { seed: ['G', 'D', 'G'], chords: [ {name: 'D', probability: 1}]}
      );
    });
    
    it('should support Maj7 chords', function() {
      assert.deepEqual(
        chordie.predictChord('C Cmaj7', ['C Cmaj7 G']),
        {seed: ['C', 'Cmaj7'], chords: [{name: 'G', probability: 1}]}
      );
    });
        
    it('handles diverging options', function() {
      assert.deepEqual(
        chordie.predictChord('C G C', ['A E A E', 'G D G C']),
        {seed: ['C', 'G', 'C'], chords: [{name: 'G', probability: 0.5},{name: 'F', probability: 0.5}]}
      );
      
      assert.deepEqual(
        chordie.predictChord('C G C', ['A E A E', 'G D G D', 'G D G C']),
        {seed: ['C', 'G', 'C'], chords: [{name: 'G', probability: 0.6666666666666666},{name: 'F', probability: 0.3333333333333333}]}
      );
    });
  });
});
