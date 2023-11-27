function drawAxis() {
  const graphContainer = document.getElementById('graph-container')
  const width = graphContainer.offsetWidth
  const height = graphContainer.offsetHeight

  const xAxis = document.createElement('div')
  xAxis.className = 'axis x-axis'
  graphContainer.appendChild(xAxis)

  const yAxis = document.createElement('div')
  yAxis.className = 'axis y-axis'
  graphContainer.appendChild(yAxis)

  for (let i = 0; i < width; i++) {
    if (i % 20 === 0) {
      const line = document.createElement('div')
      line.style.position = 'absolute'
      line.style.backgroundColor = '#000'
      line.style.width = '1px'
      line.style.height = '6px'
      line.style.left = i + 'px'
      line.style.bottom = 'calc(50% - 3px)'
      graphContainer.appendChild(line)
    }
  }

  for (let i = 0; i < height; i++) {
    if (i % 20 === 0) {
      const line = document.createElement('div')
      line.style.position = 'absolute'
      line.style.backgroundColor = '#000'
      line.style.width = '6px'
      line.style.height = '1px'
      line.style.left = 'calc(50% - 3px)'
      line.style.bottom = i + 'px'
      graphContainer.appendChild(line)
    }
  }
}

function drawFunction(func, color) {
  const graphContainer = document.getElementById('graph-container')
  const width = graphContainer.offsetWidth
  const height = graphContainer.offsetHeight
  const scale = 20

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.style.position = 'absolute'
  canvas.style.left = '0'
  canvas.style.bottom = '0'

  const context = canvas.getContext('2d')
  context.strokeStyle = color
  context.lineWidth = 2



  for (let x = -width / 2; x < width / 2; x += 0.1) {
    const y = -func(x / scale) * scale
    context.lineTo(x + width / 2, y + height / 2);
  }

  context.stroke()
  graphContainer.appendChild(canvas)
}


function findIntersection(func1, func2) {

  const epsilon = 1e-10; 
  const f = (x) => func1(x) - func2(x)

  let x = 0 
  let delta = f(x) / derivative(f, x) 

  while (Math.abs(delta) > epsilon) {
    x = x - delta
    delta = f(x) / derivative(f, x)
  }

  const y = func1(x)

  function derivative(func, x) {
    const h = 1e-5 
  
    return (func(x + h) - func(x - h)) / (2 * h)
  }

  return { x: parseFloat(x.toFixed(5)), y: parseFloat(y.toFixed(5)) }
}

function findZerosOfFunction(func) {
    let xZero

    for (let x = -100; x <= 100; x++) {
        let y = func(x);

        if (Math.abs(y) < 0.0001) {
            xZero = parseFloat(x.toFixed(5))
        }
    }

    let yZero = parseFloat(func(0).toFixed(5))

    if (yZero == -0) {
      yZero = 0
    }

    return { x: xZero, y: yZero }
}



// ↓↓↓↓↓↓ FUNCTIONS ↓↓↓↓↓↓

let functions = [ x => -x/3 + 1 , x => -2*x + 2 , x => -3*x + 3 ] 
// Add functions here if you want to. You can also try e.g: [ x => -x/2 , x => -x/3 + 2 ]

let colors = ['blue', 'red', 'green', 'purpule', 'yellow', 'orange']

// ↑↑↑↑↑↑ FUNCTIONS ↑↑↑↑↑↑



drawAxis()

let yZeros = []
let xZeros = []
let intersection = []

for (let i = 0; i < functions.length; i++) {
  drawFunction(functions[i], colors[i])

  yZeros.push([findZerosOfFunction(functions[i]).x, 0])
  xZeros.push([0, findZerosOfFunction(functions[i]).y])

  for (let j = i + 1; j < functions.length; j++) {   
    intersection.push([findIntersection(functions[i], functions[j]).x, findIntersection(functions[i], functions[j]).y])
  }
}

for (let i = 0; i < xZeros.length; i++) {
  if (xZeros[i][0]*xZeros[i][1] < 0 || xZeros[i][0]+xZeros[i][1] < 0) {
    xZeros.splice(i,1)
  }
}

for (let i = 0; i < yZeros.length; i++) {
  if (yZeros[i][0]*yZeros[i][1] < 0 || yZeros[i][0]+yZeros[i][1] < 0) {
    yZeros.splice(i,1)
  }
}


for (let i = 0; i < intersection.length; i++) {
  if (intersection[i][0]*intersection[i][1] < 0 || intersection[i][0]+intersection[i][1] < 0) {
    intersection.splice(i,1)
  }
}

function uniqueElements(array) {
  const uniqueArrays = []

  for (const subArray of array) {
    const isUnique = !uniqueArrays.some(existingArray => JSON.stringify(existingArray) === JSON.stringify(subArray))

    if (isUnique) {
      uniqueArrays.push(subArray)
    }
  }

  return uniqueArrays
}

let allIntersections = uniqueElements([...yZeros, ...xZeros, ...intersection])

console.log(allIntersections) 


let constraintPoints = [[0, 0]]
let flattedYzeros = yZeros.flat().filter(num => num !== 0)
let minYzero = Math.min(...flattedYzeros)

let flattedXzeros = xZeros.flat().filter(num => num !== 0)
let minXzero = Math.min(...flattedXzeros)
let minIntersection = []


for (let i = 0; i < intersection.length; i++) {
  minIntersection.push((intersection[i][0] ** 2) + (intersection[i][1] ** 2))
}

let minIntersectionIndex = minIntersection.indexOf(Math.min(...minIntersection))
constraintPoints.push([minYzero, 0], [0, minXzero])

if (intersection.length !== 0) {
  constraintPoints.push(intersection[minIntersectionIndex])
}
console.log(constraintPoints)


let outputElement = document.getElementById("constPoints")

constraintPoints.forEach(subArray => {
  let subArrayText = document.createTextNode(`[${subArray.join(', ')}]`)

  let arrayItemElement = document.createElement("div")
  arrayItemElement.className = "arrayItem"
  arrayItemElement.appendChild(subArrayText)

  outputElement.appendChild(arrayItemElement)
})


let z = []

for (let i = 0; i < constraintPoints.length; i++) {
  z.push(constraintPoints[i][0] + 2*constraintPoints[i][1])
}

let zMax = Math.max(...z)
let zMin = Math.min(...z)


let zMaxValue = document.getElementById('zMaxValue')
let zMinValue = document.getElementById('zMinValue')

zMaxValue.innerText = zMax
zMinValue.innerText = zMin