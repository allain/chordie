export class DecisionTree {
  constructor() {
    this.count = 0
    this.steps = {}
  }

  step(chord) {
    var tree = this.steps[chord] || new DecisionTree()
    tree.count++
    this.steps[chord] = tree
    return tree
  }

  predictNext(chords) {
    var nextStep = this

    chords.forEach(function (c) {
      if (nextStep) {
        nextStep = nextStep.steps[c]
      }
    })

    var predictions = []

    var total = 0
    Object.entries(nextStep?.steps || []).forEach(([name, s]) => {
      total += s.count

      predictions.push({
        name: name,
        count: s.count
      })
    })

    predictions.sort((a, b) => b.count - a.count)

    predictions.forEach((p) => {
      p.probability = p.count / total
    })

    return predictions
  }

  toString(depth) {
    depth = depth || 0

    var total = 0

    Object.values(this.steps).forEach(function (s) {
      total += s.count
    })

    var result = []
    Object.entries(this.steps).forEach(([c, s]) => {
      result.push(c + ' - ' + s.count / total)
      result.push(s.toString(depth + 1))
    })
    var left = '                   '.substr(depth * 2)

    return (left + result.join('\n' + left)).replace(/\s+\n\s+\n/, '\n')
  }
}
