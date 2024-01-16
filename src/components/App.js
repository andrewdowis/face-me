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

const Thing = ({ title, value }) => {
  const canvasRef = useRef()
  const canvasStrokeRef = useRef()
  const [response, setResponse] = useState()
  const [facesArray, setFacesArray] = useState([])
  const [error, setError] = useState("")
  const [img2, setImg2] = useState()

  const build = async () => {
    const img = new Image()
    img.src = value

    img.onload = async () => {
      // const { current: c } = canvasRef
      // const { current: cStroke } = canvasStrokeRef
      // var ctx = c.getContext("2d", { willReadFrequently: true })
      // var ctxStroke = cStroke.getContext("2d", { willReadFrequently: true })

      // const strokeSize = 40 + 1

      // c.width = Math.min(img.width, 400)
      // c.height = (c.width / img.width) * img.height
      // ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, c.width, c.height) // draw in image

      // const bounds = {
      //   left: 0,
      //   right: c.width - 1,
      //   top: 0,
      //   bottom: c.height - 1,
      // }

      // for (let i = 0; i < c.width; i++) {
      //   const array = [i, 0, 1, c.height]
      //   const data = ctx.getImageData.apply(ctx, array).data
      //   const value = data.reduce((acc, cur) => cur + acc, 0)

      //   if (value) {
      //     bounds.left = array
      //     break
      //   }
      // }
      // for (let i = c.width; i > -1; i--) {
      //   const array = [i, 0, 1, c.height]
      //   const data = ctx.getImageData.apply(ctx, array).data
      //   const value = data.reduce((acc, cur) => cur + acc, 0)

      //   if (value) {
      //     bounds.right = array
      //     break
      //   }
      // }

      // for (let i = 0; i < c.height; i++) {
      //   const array = [bounds.left[0], i, bounds.right[0] - bounds.left[0], 1]
      //   const data = ctx.getImageData.apply(ctx, array).data
      //   const value = data.reduce((acc, cur) => cur + acc, 0)

      //   if (value) {
      //     bounds.top = array
      //     break
      //   }
      // }
      // for (let i = c.height; i > -1; i--) {
      //   const array = [bounds.left[0], i, bounds.right[0] - bounds.left[0], 1]
      //   const data = ctx.getImageData.apply(ctx, array).data
      //   const value = data.reduce((acc, cur) => cur + acc, 0)

      //   if (value) {
      //     bounds.bottom = array
      //     break
      //   }
      // }

      // // ctx.fillStyle = "red"
      // // Object.entries(bounds).forEach(([key, array]) => {
      // //   ctx.rect.apply(ctx, array)
      // //   ctx.fill()
      // // })

      // // the number 45 represents 1/8 of a circle
      // // by increasing the number the stroke will be better fitted around the source image
      // const left = bounds.left[0]
      // const top = bounds.top[1]
      // cStroke.width = bounds.right[0] - left + strokeSize * 2
      // cStroke.height = bounds.bottom[1] - top + strokeSize * 2

      // const drawButOffset = (x, y) => {
      //   // ctxStroke.drawImage(c, x, y)
      //   ctxStroke.drawImage(c, x - left + strokeSize, y - top + strokeSize)
      // }

      // // ctxStroke.lineWidth = strokeSize * 2
      // // ctxStroke.beginPath()
      // // ctxStroke.strokeStyle = "red"
      // // ctxStroke.lineCap = "round"
      // // ctxStroke.lineJoin = "round"
      // // ctxStroke.moveTo(strokeSize, strokeSize)
      // // ctxStroke.lineTo(strokeSize + c.width, strokeSize)
      // // ctxStroke.lineTo(strokeSize + c.width, strokeSize + c.height)
      // // ctxStroke.lineTo(strokeSize, strokeSize + c.height)
      // // ctxStroke.closePath()
      // // ctxStroke.stroke()

      // // for (let b = 0; b < 5; b++) {
      // //   for (let i = 0; i < 45; i += 4) {
      // //     for (let s = 1; s < strokeSize; s++) {
      // //       let [x, y] = getAnglePoint(0, 0, s, toRadians(i + b + s / strokeSize))

      // //       drawButOffset(x, y)
      // //       drawButOffset(x, -y)
      // //       drawButOffset(-x, -y)
      // //       drawButOffset(-x, y)
      // //       drawButOffset(y, x)
      // //       drawButOffset(y, -x)
      // //       drawButOffset(-y, -x)
      // //       drawButOffset(-y, x)
      // //     }
      // //   }
      // // }

      // ctxStroke.fillStyle = "white"
      // ctxStroke.globalCompositeOperation = "source-in"
      // ctxStroke.rect(0, 0, cStroke.width, cStroke.height)
      // ctxStroke.fill()

      // ctxStroke.globalCompositeOperation = "source-over"
      // ctxStroke.drawImage(c, -left + strokeSize, -top + strokeSize)

      // console.log(
      //   `%c MAKE THE IMAGE API CALL`,
      //   `color: black; background-color: cyan; font-style: italic; padding: 0px; margin-left: 0px;`
      // )

      const canvas = canvasRef.current
      const ratio = img.width / img.height
      canvas.width = Math.min(img.width, 2000)
      canvas.height = Math.min(canvas.width / ratio, 2000)
      canvas.width = Math.min(canvas.height * ratio, 2000)

      const ctx1 = canvas.getContext("2d")

      ctx1.fillStyle = "white"
      ctx1.rect(0, 0, canvas.width, canvas.height)
      ctx1.fill()

      ctx1.drawImage(img, 0, 0, canvas.width, canvas.height)

      // makeBlob(canvas)

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
          return <img key={`face---${i}`} src={image_url} alt={`face---${i}`} />
        })}
        {error && <div className="error-box">{error}</div>}
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
        {Object.entries(images).map(([key, value], i) => {
          // if (!key.includes("man1.png")) return null
          if (key.includes("crop")) return null
          // if (i) return null

          return <Thing title={key} key={`key---${i}`} {...{ value }} />
        })}
      </div>
    </div>
  )
}

export default App
