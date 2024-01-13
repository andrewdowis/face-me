import "./App.scss"

import { useEffect, useLayoutEffect, useState } from "react"

import imglyRemoveBackground from "@imgly/background-removal"

function importAll(r) {
  let images = {}
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item)
  })
  return images
}
const images = importAll(require.context("../assets/images/faces", false, /\.(png|jpe?g|svg)$/))

// const Thing = ({ title, value }) => {
//   console.log("TITLE", title)

//   const [image, setImage] = useState()

//   useLayoutEffect(() => {
//     const img = new Image()
//     img.src = value
//     img.onload = () => {
//       console.log("LOAD")
//       var c = document.createElement("canvas")
//       var ctx = c.getContext("2d")

//       c.width = Math.min(img.width, 200)
//       c.height = (c.width / img.width) * img.height
//       ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, c.width, c.height) // draw in image

//       // setImage(img)
//       // return
//       c.toBlob(
//         function (blob) {
//           // return setImage(URL.createObjectURL(blob))
//           imglyRemoveBackground(blob)
//             .then(blob => {
//               // The result is a blob encoded as PNG. It can be converted to an URL to be used as HTMLImage.src
//               console.log(
//                 `%c BLOB`,
//                 `color: black; background-color: lime; font-style: italic; padding: 0px; margin-left: 0px;`
//               )
//               console.log(blob)

//               const other = new Image()
//               other.onload = () => {
//                 console.log(
//                   `%c DONE?!!!`,
//                   `color: white; background-color: blue; font-style: italic; padding: 0px; margin-left: 0px;`
//                 )
//                 setImage(other)
//               }
//               other.src = URL.createObjectURL(blob)
//               console.warn(other.src)

//               // const url = URL.createObjectURL(blob);
//             })
//             .catch(error => {
//               console.log(
//                 `%c no...`,
//                 `color: white; background-color: red; font-style: italic; padding: 0px; margin-left: 0px;`
//               )
//               console.log(error)
//             })
//         },
//         "image/jpeg",
//         0.75
//       )
//     }
//   }, [])

//   if (!image) return null

//   console.log(
//     `%c OK MAN!`,
//     `color: black; background-color: white; font-style: italic; padding: 0px; margin-left: 0px;`
//   )
//   console.log(image)
//   console.log(image.src)
//   return (
//     <div className="image-with-faces">
//       <h4>{title}</h4>
//       <div className="images">
//         <img src={value} />
//         <img src={image.src} />
//         {/* <img src={image.src} /> */}
//       </div>
//     </div>
//   )
// }

function App() {
  return (
    <div className="App">
      THE APP
      <div className="image-container" id="image-container">
        {Object.entries(images).map(([key, value], i) => {
          if (!key.includes("man1")) return null
          // if (i) return null

          // return <img src={value} alt={key} key={key} />
          return (
            <div className="image-with-faces">
              <h4>{key}</h4>
              <div className="images">
                <img src={value} alt={key} key={key} />
              </div>
            </div>
          )
          // return <Thing key={key} title={key} value={value} />
        })}
      </div>
    </div>
  )
}

export default App
