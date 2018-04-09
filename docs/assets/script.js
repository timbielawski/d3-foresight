document.addEventListener("DOMContentLoaded", function () {

let config = {
  pointType: 'mmwr-week', // Default is regular-week
  axes: {
    y: {
      title: 'Random numbers' // Title for the y axis
    }
  }
}

let timePoints = [...Array(51).keys()].map(w => {
  return { week: w + 1, year: 2016 }
})

// Random sequence generator
function rseq (n) {
  let seq = [Math.random()]
  for (let i = 1; i < n; i++) {
    seq.push(Math.random() * (1 + seq[i - 1]))
  }
  return seq
}

// Predictions look like [{ series: [{ point: 0.5 }, { point: 1.2 } ...] }, ..., null, null]
let predictions = timePoints.map(tp => {
  if (tp.week > 30) {
    // We only predict upto week 30
    return null
  } else {
    // Provide 10 week ahead predictions
    return {
      series: rseq(10).map(r => { return { point: r } })
    }
  }
})

let data = {
  timePoints,
  models: [
    {
      id: 'mod',
      meta: {
        name: 'Name',
        description: 'Model description here',
        url: 'http://github.com'
      },
      predictions
    }
  ]
}

// 1. Initialize
// Setup the id of div where we are going to plot
// Also pass in config options
let timeChart = new d3Foresight.TimeChart('#timechart', config)

// 2. Plot
// Provide the data for the complete year
timeChart.plot(data)

// 3. Update
// Move to the given index in the set of timePoints
timeChart.update(10)
// Or simply use
// timeChart.moveForward()
// timeChart.moveBackward()

// Lets also save the timechart object in global namespace
window.timeChart = timeChart

let copy = it => Object.assign({}, it)

let tcBaseline = new d3Foresight.TimeChart('#tc-baseline', Object.assign(copy(config), {
  baseline: {
    text: 'Baseline', // To show multiline text, pass an array of strings,
    description: 'This is a sample baseline',
    url: 'https://github.com'
  }
}))
tcBaseline.plot(Object.assign(copy(data), {
  baseline: 0.3
}))
tcBaseline.update(10)

// Suppose we have actual data for 20 time steps only. We give null for other points
let actual = rseq(20).concat(timePoints.slice(20).map(tp => null))

let tcActual = new d3Foresight.TimeChart('#tc-actual', config)
tcActual.plot(Object.assign(copy(data), { actual: actual }))
tcActual.update(10)

})
