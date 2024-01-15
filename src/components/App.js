import "./App.scss"

import { useEffect, useRef, useState } from "react"

function toRadians(degree) {
  return (Math.PI / 180.0) * degree
}

function getAnglePoint(x, y, distance, angle) {
  var x = x + Math.cos(angle) * distance
  var y = y + Math.sin(angle) * distance

  return [x, y]
}

function importAll(r) {
  let images = {}
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item)
  })
  return images
}
const images = importAll(require.context("../assets/images/faces", false, /\.(png|jpe?g|svg)$/))

const Thing = ({ title, value, callback, method }) => {
  const canvasRef = useRef()
  const canvasStrokeRef = useRef()

  useEffect(() => {
    const img = new Image()
    img.src = value

    img.onload = () => {
      const { current: c } = canvasRef
      const { current: cStroke } = canvasStrokeRef
      var ctx = c.getContext("2d", { willReadFrequently: true })
      var ctxStroke = cStroke.getContext("2d", { willReadFrequently: true })

      const strokeSize = 40 + 1

      c.width = Math.min(img.width, 400)
      c.height = (c.width / img.width) * img.height
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, c.width, c.height) // draw in image

      const bounds = {
        left: 0,
        right: c.width - 1,
        top: 0,
        bottom: c.height - 1,
      }

      ctx.fillStyle = "red"

      console.log("\t running new version?", method)
      let pixels = 0
      if (method === "method1") {
        for (let i = 0; i < c.width; i++) {
          const array = [i, 0, 1, c.height]
          const data = ctx.getImageData.apply(ctx, array).data
          const value = data.reduce((acc, cur) => cur + acc, 0)

          pixels += data.length / 4
          if (value) {
            bounds.left = array
            break
          }
        }
        for (let i = c.width; i > -1; i--) {
          const array = [i, 0, 1, c.height]
          const data = ctx.getImageData.apply(ctx, array).data
          const value = data.reduce((acc, cur) => cur + acc, 0)

          pixels += data.length / 4
          if (value) {
            bounds.right = array
            break
          }
        }

        for (let i = 0; i < c.height; i++) {
          const array = [0, i, c.width, 1]
          const data = ctx.getImageData.apply(ctx, array).data
          const value = data.reduce((acc, cur) => cur + acc, 0)

          pixels += data.length / 4
          if (value) {
            bounds.top = array
            break
          }
        }
        for (let i = c.height; i > -1; i--) {
          const array = [0, i, c.width, 1]
          const data = ctx.getImageData.apply(ctx, array).data
          const value = data.reduce((acc, cur) => cur + acc, 0)

          pixels += data.length / 4
          if (value) {
            bounds.bottom = array
            break
          }
        }
      } else if (method === "method2") {
        for (let i = 0; i < c.width; i++) {
          const array = [i, 0, 1, c.height]
          const data = ctx.getImageData.apply(ctx, array).data
          const value = data.reduce((acc, cur) => cur + acc, 0)

          pixels += data.length / 4
          if (value) {
            bounds.left = array
            break
          }
        }
        for (let i = c.width; i > -1; i--) {
          const array = [i, 0, 1, c.height]
          const data = ctx.getImageData.apply(ctx, array).data
          const value = data.reduce((acc, cur) => cur + acc, 0)

          pixels += data.length / 4
          if (value) {
            bounds.right = array
            break
          }
        }

        for (let i = 0; i < c.height; i++) {
          const array = [bounds.left[0], i, bounds.right[0] - bounds.left[0], 1]
          const data = ctx.getImageData.apply(ctx, array).data
          const value = data.reduce((acc, cur) => cur + acc, 0)

          pixels += data.length / 4
          if (value) {
            bounds.top = array
            break
          }
        }
        for (let i = c.height; i > -1; i--) {
          const array = [bounds.left[0], i, bounds.right[0] - bounds.left[0], 1]
          const data = ctx.getImageData.apply(ctx, array).data
          const value = data.reduce((acc, cur) => cur + acc, 0)

          pixels += data.length / 4
          if (value) {
            bounds.bottom = array
            break
          }
        }
      }

      callback && callback(pixels)

      // Object.entries(bounds).forEach(([key, array]) => {
      //   console.log("OK GO", key)
      //   console.log(array)
      //   if (!Array.isArray(array)) return

      //   ctx.rect.apply(ctx, array)
      //   ctx.fill()
      // })

      // return callback && callback()

      // the number 45 represents 1/8 of a circle
      // by increasing the number the stroke will be better fitted around the source image
      const left = bounds.left[0]
      const top = bounds.top[1]
      cStroke.width = bounds.right[0] - left + strokeSize * 2
      cStroke.height = bounds.bottom[1] - top + strokeSize * 2

      const drawButOffset = (x, y) => {
        // ctxStroke.drawImage(c, x, y)
        ctxStroke.drawImage(c, x - left + strokeSize, y - top + strokeSize)
      }

      for (let i = 0; i < 45; i += 4) {
        for (let s = 1; s < strokeSize; s++) {
          let [x, y] = getAnglePoint(0, 0, s, toRadians(i + s / strokeSize))

          drawButOffset(x, y)
          drawButOffset(x, -y)
          drawButOffset(-x, -y)
          drawButOffset(-x, y)
          drawButOffset(y, x)
          drawButOffset(y, -x)
          drawButOffset(-y, -x)
          drawButOffset(-y, x)
        }
      }

      let color = "white"
      if (method === "method2") color = "blue"
      if (method === "method3") color = "yellow"
      if (method === "method4") color = "black"

      ctxStroke.fillStyle = color
      ctxStroke.globalCompositeOperation = "source-in"
      ctxStroke.rect(0, 0, cStroke.width, cStroke.height)
      ctxStroke.fill()

      ctxStroke.globalCompositeOperation = "source-over"
      ctxStroke.drawImage(c, -left + strokeSize, -top + strokeSize)

      return callback && callback(pixels)
    }
  }, [method])

  return (
    <div className="image-with-faces">
      <h4>{title}</h4>
      <div className="images">
        <img src={value} alt={title} />
        <canvas ref={canvasRef} />
        <canvas ref={canvasStrokeRef} />
      </div>
    </div>
  )
}

function App() {
  const start = useRef()
  const [imageArray, setImageArray] = useState()
  const [total, setTotal] = useState()
  const done = useRef()
  const [iteration, setIteration] = useState(0)

  const values = useRef([[], [], [], []])
  const pixelCounts = useRef([[], [], [], []])

  useEffect(() => console.clear(), [])

  useEffect(() => {
    done.current = 0
    let array = Object.entries(images)
    const finalArray = []
    // const finalArray = array.filter(([key, value]) => key.includes("crop"))
    for (let i = 0; i < 20; i++) finalArray.push(...array)

    const total = finalArray.filter(([key, value]) => key.includes("crop")).length

    setImageArray(finalArray)
    setTotal(total)

    console.log(
      `%c starting, round ${iteration + 1}`,
      `color: black; background-color: lime; font-style: italic; padding: 0px; margin-left: 0px;`
    )
    console.time()
    start.current = new Date()
  }, [iteration])

  const callback = pixels => {
    if (++done.current === total) {
      const end = new Date()

      const duration = end.getTime() - start.current.getTime()
      console.log(duration)
      console.timeEnd()
      const version = iteration % 2
      console.log("ENDING BUT", version)
      values.current[version].push(duration)
      pixelCounts.current[version].push(pixels)
      if (iteration + 1 < 12) {
        setIteration(iteration + 1)
      } else {
        console.log(
          `%c DONE DONE DONE`,
          `color: black; background-color: orange; font-style: italic; padding: 0px; margin-left: 0px;`
        )
        const average1 = values.current[0].reduce((acc, cur) => acc + cur, 0) / values.current[0].length
        const average2 = values.current[1].reduce((acc, cur) => acc + cur, 0) / values.current[1].length
        const average3 = values.current[2].reduce((acc, cur) => acc + cur, 0) / values.current[2].length
        const average4 = values.current[3].reduce((acc, cur) => acc + cur, 0) / values.current[3].length

        const pixelAverage1 = pixelCounts.current[0].reduce((acc, cur) => acc + cur, 0) / pixelCounts.current[0].length
        const pixelAverage2 = pixelCounts.current[1].reduce((acc, cur) => acc + cur, 0) / pixelCounts.current[1].length
        const pixelAverage3 = pixelCounts.current[2].reduce((acc, cur) => acc + cur, 0) / pixelCounts.current[2].length
        const pixelAverage4 = pixelCounts.current[3].reduce((acc, cur) => acc + cur, 0) / pixelCounts.current[3].length

        console.log(values.current)
        console.log(pixelCounts.current)
        const averages = { average1, average2, average3, average4 }
        let min = { key: "", value: Infinity }
        console.log(average1, average2, average3, average4)
        Object.entries(averages).forEach(([key, value]) => {
          if (value < min.value) {
            min.key = key
            min.value = value
          }
        })
        console.log(`${min.key} value is the fastest`)

        const pixelAverages = { pixelAverage1, pixelAverage2, pixelAverage3, pixelAverage4 }
        min = { key: "", value: Infinity }
        console.log(pixelAverage1, pixelAverage2, pixelAverage3, pixelAverage4)
        Object.entries(pixelAverages).forEach(([key, value]) => {
          if (value < min.value) {
            min.key = key
            min.value = value
          }
        })
        console.log(`${min.key} has the fewest pixels`)
      }
    }
  }

  if (!imageArray?.length) return null

  return (
    <div className="App">
      THE APP
      <div className="image-container" id="image-container">
        {imageArray.map(([key, value], i) => {
          if (!key.includes("crop")) return null
          // if (i) return null

          // return <img src={value} alt={key} key={key} />
          // return (
          //   <div className="image-with-faces">
          //     <h4>{key}</h4>
          //     <div className="images">
          //       <img src={value} alt={key} key={key} />
          //     </div>
          //   </div>
          // )
          return (
            <Thing title={key} key={`key---${i}`} {...{ value, callback }} method={`method${(iteration % 2) + 1}`} />
          )
        })}
      </div>
    </div>
  )
}

export default App
