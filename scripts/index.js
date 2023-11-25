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
    const y = -func(x / scale) * scale;
    context.lineTo(x + width / 2, y + height / 2);
  }

  context.stroke()
  graphContainer.appendChild(canvas)
}


function findIntersection(func1, func2) {

  const epsilon = 1e-10; 
  const f = (x) => func1(x) - func2(x);

  let x = 0; 
  let delta = f(x) / derivative(f, x); 

  while (Math.abs(delta) > epsilon) {
    x = x - delta;
    delta = f(x) / derivative(f, x);
  }

  const y = func1(x);

  function derivative(func, x) {
    const h = 1e-5; 
  
    return (func(x + h) - func(x - h)) / (2 * h);
  }

  return { x: parseFloat(x.toFixed(5)), y: parseFloat(y.toFixed(5)) };
}

function findZerosOfFunction(func) {
    let xZero;

    for (let x = -100; x <= 100; x++) {
        let y = func(x);

        if (Math.abs(y) < 0.0001) {
            xZero = parseFloat(x.toFixed(5));
        }
    }

    let yZero = parseFloat(func(0).toFixed(5))

    if (yZero == -0) {
      yZero = 0
    }

    return { x: xZero, y: yZero };
}



// ↓↓↓↓↓↓ FUNCTIONS ↓↓↓↓↓↓

let functions = [ x => -x/3 + 1 , x => -2*x + 2 , x => -3*x + 3 ] // add functions here if you want to
let colors = ['blue', 'red', 'green', 'purpule', 'yellow', 'orange']

// ↑↑↑↑↑↑ FUNCTIONS ↑↑↑↑↑↑



let yZeros = {}
let xZeros = {}
let intersection = {}
let m = 0

for (let i = 0; i < functions.length; i++) {
  drawFunction(functions[i], colors[i])

  yZeros[i] = [findZerosOfFunction(functions[i]).x, 0];
  xZeros[i] = [0, findZerosOfFunction(functions[i]).y];

  for (let j = i + 1; j < functions.length; j++) {   
    intersection[m] = [findIntersection(functions[i], functions[j]).x, findIntersection(functions[i], functions[j]).y]
    console.log(intersection[m])
    m += 1
  }
  
  console.log(yZeros[i])
  console.log(xZeros[i])
}

drawAxis()