var _ = require('lodash');

module.exports = DecisionTree;

function DecisionTree() {
  this.count = 0;
  this.steps = {};
}

DecisionTree.prototype.step = function(chord) {
  var tree = this.steps[chord] || new DecisionTree();
  tree.count ++;  
  this.steps[chord] = tree;
  return tree;
};

DecisionTree.prototype.predictNext = function(chords) {
  if (chords.length === 0) return this;
  
  var nextStep = this;
  
  chords.forEach(function(c) {
    if (nextStep) {
      nextStep = nextStep.steps[c];
    }
  });
  
  var predictions = [];
  
  var total = 0;
  _.forIn(nextStep ? nextStep.steps : [], function(s, name) {
    total += s.count;
    
    predictions.push({
      'name': name,
      'count': s.count
    });
  });
  
  predictions.sort(function(a, b) {
    return b.count - a.count;
  });
  
  predictions.forEach(function(p) {
    p.probability = p.count / total;
  });
  
  return predictions;    
};

DecisionTree.prototype.toString = function(depth) {
  depth = depth || 0;
  
  var total = 0;
  
  _.forIn(this.steps, function(s) {
    total += s.count;
  });

  var result = [];
  _.forIn(this.steps, function(s, c) {
    result.push(c + " - " + (s.count / total));
    result.push(s.toString(depth + 1));
  });
  var left = "                   ".substr(depth * 2);
  
  return (left + result.join("\n" + left)).replace(/\s+\n\s+\n/, '\n');
};
