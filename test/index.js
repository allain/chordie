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
  });
  
  describe('guess chord', function() {
    it('should support simple case', function() {
      assert.deepEqual([
        {name: 'E', probability: 1},        
      ], chordie.predictChord('A E A', ['A E A E']));
    });
    
    it('supports prediction in normalized form', function() {
     assert.deepEqual([
        {name: 'V', probability: 1},        
      ], chordie.predictChord('I V I', ['A E A E']));
    });
    
    it('should support change of key', function() {
      assert.deepEqual([
        {name: 'D', probability: 1},        
      ], chordie.predictChord('G D G', ['A E A E']));
    });
    
    it('handles diverging options', function() {
      assert.deepEqual([
        {name: 'G', probability: 0.5},
        {name: 'F', probability: 0.5}
      ], chordie.predictChord('C G C', ['A E A E', 'G D G C']));

      assert.deepEqual([
        {name: 'G', probability: 0.6666666666666666},
        {name: 'F', probability: 0.3333333333333333}
      ], chordie.predictChord('C G C', ['A E A E', 'G D G D', 'G D G C']));

    });
  });
});
