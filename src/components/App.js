import "./App.scss"

import { useEffect, useRef, useState } from "react"

import FaceImg from "../assets/images/facePng.png"
// import FaceImg2 from "../assets/images/facePng2.png"
import FaceImg2 from "../assets/images/faces/crop1.png"

function toRadians(degree) {
  return (Math.PI / 180.0) * degree
}

function getAnglePoint(x, y, distance, angle) {
  var x = x + Math.cos(angle) * distance
  var y = y + Math.sin(angle) * distance

  return [x, y]
}

// function importAll(r) {
//   let images = {}
//   r.keys().forEach((item, index) => {
//     images[item.replace("./", "")] = r(item)
//   })
//   return images
// }
// const images = importAll(require.context("../assets/images/faces", false, /\.(png|jpe?g|svg)$/))

const StrokeItem = ({ url }) => {
  const canvasRef = useRef()
  const canvasStrokeRef = useRef()
  const canvasStroke2Ref = useRef()

  const build = async () => {
    const img = new Image()
    img.src = url

    img.onload = async () => {
      const { current: c } = canvasRef
      const { current: cStroke } = canvasStrokeRef
      const { current: cStroke2 } = canvasStroke2Ref

      var ctx = c.getContext("2d", { willReadFrequently: true })
      var ctxStroke = cStroke.getContext("2d", { willReadFrequently: true })
      var ctxStroke2 = cStroke2.getContext("2d", { willReadFrequently: true })

      const strokeSize = 40 + 1

      c.width = img.width
      c.height = (c.width / img.width) * img.height
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, c.width, c.height) // draw in image

      // the number 45 represents 1/8 of a circle
      // by increasing the number the stroke will be better fitted around the source image
      cStroke.width = c.width + strokeSize * 2
      cStroke.height = c.height + strokeSize * 2
      cStroke2.width = cStroke.width
      cStroke2.height = cStroke.height
      // cStroke2.width = c.width
      // cStroke2.height = c.height

      const drawButOffset = (x, y) => {
        // ctxStroke.drawImage(c, x, y)
        ctxStroke.drawImage(c, x + strokeSize, y + strokeSize)
      }

      const start1 = new Date()
      for (let b = 0; b < 1; b++) {
        for (let i = 0; i < 45; i += 4) {
          for (let s = 1; s < strokeSize; s++) {
            let [x, y] = getAnglePoint(0, 0, s, toRadians(i + b + s / strokeSize))
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
      }

      // old stroke
      ctxStroke.fillStyle = "white"
      ctxStroke.globalCompositeOperation = "source-in"
      ctxStroke.rect(0, 0, cStroke.width, cStroke.height)
      ctxStroke.fill()
      ctxStroke.globalCompositeOperation = "source-over"
      ctxStroke.drawImage(c, strokeSize, strokeSize)

      const end1 = new Date()

      // new stroke
      const start2 = new Date()

      const strokeData = ctx.getImageData(0, 0, c.width, c.height).data
      const { width } = c

      console.log(width)
      const leftPoints = []
      const rightPoints = []
      // for (let r = 0; r < width * 4; r += width * 4) {
      for (let r = 0; r < strokeData.length; r += width * 4) {
        const rowNum = r / (width * 4)
        const rowData = strokeData.slice(r, r + width * 4)

        let bounds = []

        for (let p = 0; p < rowData.length; p += 4) {
          const colNum = p / 4
          const [r, g, b, a] = rowData.slice(p, p + 4)
          if (a > 250) bounds.push(colNum)
        }

        if (bounds.length) {
          leftPoints.push({ rowNum, p: bounds[0] })
          rightPoints.push({ rowNum, p: bounds.at(-1) - 1 })
        }
      }

      ctxStroke2.lineCap = "round"
      ctxStroke2.lineJoin = "round"
      ctxStroke2.lineWidth = strokeSize * 2
      ctxStroke2.strokeStyle = "white"

      ctxStroke2.beginPath()

      const joined = [...leftPoints, ...rightPoints.reverse()]

      joined.forEach(({ rowNum, p }, i) => {
        // if (i % 4) return
        ctxStroke2[i ? "lineTo" : "moveTo"](p + strokeSize, rowNum + strokeSize)
      })

      ctxStroke2.closePath()
      ctxStroke2.stroke()
      ctxStroke2.drawImage(c, strokeSize, strokeSize)
      const end2 = new Date()

      console.log(
        `%c DONE`,
        `color: black; background-color: cyan; font-style: italic; padding: 0px; margin-left: 0px;`
      )
      console.log(end1.getTime() - start1.getTime(), end2.getTime() - start2.getTime())
    }
  }

  useEffect(() => {
    build()
  }, [])

  return (
    <div className="image-with-faces">
      <div className="images">
        <img src={url} alt={url} />
        <canvas ref={canvasRef} />
        <canvas ref={canvasStrokeRef} />
        <canvas ref={canvasStroke2Ref} />
      </div>
    </div>
  )
}

function App() {
  useEffect(() => console.clear(), [])

  return (
    <div className="App">
      THE APP
      <div className="image-container" id="image-container">
        {/* <StrokeItem url="https://ai-result-rapidapi.ailabtools.com/cutout/segmentHead/2024-01-15/232317-1feabe5d-9b44-7a89-2ab2-1fe98febd009-1705360997.png" /> */}
        <StrokeItem url={FaceImg} />
        <StrokeItem url={FaceImg2} />
      </div>
    </div>
  )
}

export default App
