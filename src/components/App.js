import "./App.scss"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

const toRadians = degree => (Math.PI / 180.0) * degree
const getAnglePoint = (x, y, distance, angle) => [x + Math.cos(angle) * distance, y + Math.sin(angle) * distance]

function importAll(r) {
  let images = {}
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item)
  })
  return images
}
const images = importAll(require.context("../assets/images/faces", false, /\.(png|jpe?g|svg)$/))
const images2 = importAll(require.context("../assets/images/tests", false, /\.(png|jpe?g|svg)$/))

const strokeIt = (src, canvas) => {
  const strokeSize = 40

  canvas.width = src.width + strokeSize * 2
  canvas.height = src.height + strokeSize * 2

  const ctx = canvas.getContext("2d")

  // // new stroke
  const start2 = new Date()

  // const { data: strokeData } = src.getContext("2d").getImageData(0, 0, src.width, src.height)
  // const { width } = src

  // const leftPoints = []
  // const rightPoints = []
  // // for (let r = 0; r < width * 4; r += width * 4) {
  // const skips = 2
  // for (let r = 0; r < strokeData.length; r += width * 4) {
  //   const rowNum = r / (width * 4)
  //   if (rowNum % skips) continue

  //   const rowData = strokeData.slice(r, r + width * 4)

  //   let bounds = []

  //   for (let p = 0; p < rowData.length; p += 4) {
  //     const colNum = p / 4
  //     const [r, g, b, a] = rowData.slice(p, p + 4)
  //     if (a) bounds.push(colNum)
  //   }

  //   if (bounds.length) {
  //     leftPoints.push({ rowNum, p: bounds[0] })
  //     rightPoints.push({ rowNum, p: bounds.at(-1) - 1 })
  //   }
  // }

  // ctx.lineCap = "round"
  // ctx.lineJoin = "round"
  // ctx.lineWidth = strokeSize * 2
  // ctx.strokeStyle = "white"

  // ctx.beginPath()

  // const joined = [...leftPoints, ...rightPoints.reverse()]

  // const size = Math.max(1, skips / 2)
  // joined.forEach(({ rowNum, p }, i) => {
  //   ctx[i ? "lineTo" : "moveTo"](p + strokeSize, rowNum + strokeSize)
  // })
  // ctx.closePath()
  // ctx.stroke()

  // ctx.fillStyle = "red"
  // ctx.beginPath()
  // joined.forEach(({ rowNum, p }, i) => {
  //   ctx.rect(p + strokeSize, rowNum + strokeSize, size, size)
  // })
  // ctx.closePath()
  // ctx.fill()

  ///// FILL
  const drawButOffset = (x, y) => {
    // ctx.drawImage(c, x, y)
    ctx.drawImage(src, x + strokeSize, y + strokeSize)
  }

  const sub = 10
  for (let b = 0; b < sub; b++) {
    for (let i = 0; i < 45; i += 4) {
      for (let s = 1; s < strokeSize; s++) {
        let [x, y] = getAnglePoint(0, 0, s, toRadians(i + b / sub + s / strokeSize))

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

  ctx.fillStyle = "white"
  ctx.globalCompositeOperation = "source-in"
  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.fill()

  ctx.globalCompositeOperation = "source-over"

  ctx.drawImage(src, strokeSize, strokeSize)
  const end2 = new Date()

  console.log(`%c DONE`, `color: black; background-color: cyan; font-style: italic; padding: 0px; margin-left: 0px;`)
  console.log(end2.getTime() - start2.getTime())
}

class ImageLoader {
  constructor(callback, src) {
    const img = new Image()

    img.onload = () => callback(img)

    img.crossOrigin = "anonymous"
    img.src = src

    return this
  }
}

const ImageWithCanvas = ({ src }) => {
  const canvasRef = useRef()
  const canvas2Ref = useRef()

  useLayoutEffect(() => {
    new ImageLoader(img => {
      console.log(
        `%c LOADED`,
        `color: black; background-color: cyan; font-style: italic; padding: 0px; margin-left: 0px;`
      )
      console.log(img)

      const { current: c } = canvasRef
      const ctx = c.getContext("2d")

      c.width = img.width
      c.height = img.height

      ctx.drawImage(img, 0, 0)

      try {
        localStorage.setItem("saved-image-example", c.toDataURL("image/png"))

        strokeIt(c, canvas2Ref.current)
      } catch (err) {
        console.error(`Error: ${err}`)
      }
    }, src)
  }, [])

  return (
    <div className="image-with-canvas">
      <img src={src} alt="face" />
      <canvas ref={canvasRef} />
      <canvas ref={canvas2Ref} />
    </div>
  )
}

const Thing = ({ title, value }) => {
  const canvasRef = useRef()
  const [facesArray, setFacesArray] = useState([])
  // const [facesArray, setFacesArray] = useState([
  //   {
  //     image_url:
  //       "https://ai-result-rapidapi.ailabtools.com/cutout/segmentHead/2024-01-16/022802-9e88907f-0c10-d8f6-7327-b2edc4bcfe1c-1705372082.png",
  //   },
  //   // {
  //   //   image_url:
  //   //     "https://ai-result-rapidapi.ailabtools.com/cutout/segmentHead/2024-01-16/030608-22e049d4-8864-9a50-fbd0-670dbdaee0bd-1705374368.png",
  //   // },
  //   // {
  //   //   image_url:
  //   //     "https://ai-result-rapidapi.ailabtools.com/cutout/segmentHead/2024-01-16/030603-29caf1c1-c214-ccf0-c551-73bfbc6a239b-1705374363.png",
  //   // },
  //   // {
  //   //   image_url:
  //   //     "https://ai-result-rapidapi.ailabtools.com/cutout/segmentHead/2024-01-16/030604-8d2584af-3dea-9b89-deb5-8106442824f7-1705374364.png",
  //   // },
  // ])

  const [error, setError] = useState("")

  const build = async () => {
    const img = new Image()
    img.src = value

    img.onload = async () => {
      const canvas = canvasRef.current

      console.log(img.src)

      const ratio = img.width / img.height
      canvas.width = Math.min(img.width, 2000)
      canvas.height = Math.min(canvas.width / ratio, 2000)
      canvas.width = Math.min(canvas.height * ratio, 2000)

      const ctx1 = canvas.getContext("2d")

      ctx1.fillStyle = "white"
      ctx1.rect(0, 0, canvas.width, canvas.height)
      ctx1.fill()

      ctx1.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(async blobby => {
        console.log("BLOBBY")
        console.log(blobby)
        var formdata = new FormData()
        formdata.append("image", blobby, "file")
        formdata.append("return_form", "")
        var requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow",
          headers: {
            "ailabapi-api-key": "FoRzuYBZitDA0OdmXjLccKJ8EAr2bSY66aSjh7IQMMN5d9IWvr9kvUx0fbgnafin",
          },
        }
        const results = await fetch("https://www.ailabapi.com/api/cutout/portrait/avatar-extraction", requestOptions)
          .then(response => response.text())
          .then(result => JSON.parse(result))
          .catch(error => {
            console.log("error", error)
          })
        console.log("RESULTS")
        console.log(results)
        if (results.data) {
          setFacesArray(results.data.elements)
        } else {
          setError(results.error_detail.message)
        }
      }, "image/jpeg")
      // })
    }
  }

  useEffect(() => {
    build()
  }, [])

  return (
    <div className="image-with-faces">
      <h4>{title}</h4>
      <div className="images">
        <img src={value} alt={title} />
        <canvas ref={canvasRef} />
        {/* <canvas ref={canvasStrokeRef} /> */}
        {facesArray.map(({ width, height, image_url }, i) => {
          return <ImageWithCanvas key={`face---${i}`} src={image_url} />
          // return <img key={`face---${i}`} src={image_url} alt={`face---${i}`} />
        })}
        {error && <div className="error-box">{error}</div>}
      </div>
    </div>
  )
}

function App() {
  // const [facesArray, setFacesArray] = useState([
  //   {
  //     image_url:
  //       "https://ai-result-rapidapi.ailabtools.com/cutout/segmentHead/2024-01-16/022802-9e88907f-0c10-d8f6-7327-b2edc4bcfe1c-1705372082.png",
  //   },
  //   {
  //     image_url:
  //       "https://ai-result-rapidapi.ailabtools.com/cutout/segmentHead/2024-01-16/030608-22e049d4-8864-9a50-fbd0-670dbdaee0bd-1705374368.png",
  //   },
  //   {
  //     image_url:
  //       "https://ai-result-rapidapi.ailabtools.com/cutout/segmentHead/2024-01-16/030603-29caf1c1-c214-ccf0-c551-73bfbc6a239b-1705374363.png",
  //   },
  //   {
  //     image_url:
  //       "https://ai-result-rapidapi.ailabtools.com/cutout/segmentHead/2024-01-16/030604-8d2584af-3dea-9b89-deb5-8106442824f7-1705374364.png",
  //   },
  // ])

  // const images2 = useMemo(() => {
  //   const output = {}
  //   facesArray.forEach(({ image_url }, i) => {
  //     output[`image--${i}`] = image_url
  //   })

  //   return output
  // }, [])

  // console.log(images2)

  return (
    <div className="App">
      THE APP
      <div className="image-container" id="image-container">
        {Object.entries(images2).map(([key, value], i) => {
          // if (i) return null
          // if (i > 3) return null
          // if (key !== "man1.png") return null
          // if (key.includes("crop")) return null
          // if (i) return null

          return <Thing title={key} key={`key---${i}`} {...{ value }} />
        })}
      </div>
    </div>
  )
}

export default App
