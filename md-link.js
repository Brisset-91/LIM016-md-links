
const fs = require ('fs')
const path = require('path');
const fetch = require("node-fetch");

// Revisa si el path es absoluta o relativa y lo convierte
const pathAbsolute = (paths) => {
  if (path.isAbsolute(paths)) {
    return paths
  } else {
    return path.resolve(paths)
  }
}

// Revisa si el path ingresado existe
const enteredPath = (paths) => {
  return fs.existsSync(paths)
}

// Abre y lee un directorio
const readDirectory = (paths)=>{
  return fs.readdirSync(paths)
}

//const file = './Files'
// Abre un directorio y devuelve en array
const openDirectory = (paths)=>{
  const listFiles = readDirectory(paths)
  const allFiles = []
  
  listFiles.forEach((file) => {
    const allPaths = path.resolve(paths, file)

    if (fs.statSync(allPaths).isFile()) {
    
      allFiles.push(allPaths)
    } else {
      const typeDirectory = openDirectory(allPaths)
      allFiles.push(typeDirectory.join(''))
    }
  })

  return allFiles
}
//console.log(openDirectory(file))
// filtrar archivos md
const filterMD = arrayFiles => arrayFiles.filter(file => path.extname(file) == ".md")

// Lista de link en array con expresiones regulares
// option validate: false
const getLink = (arrayPathdMD) => {
  const onlyText = /\[(.*)\]/g;
  const onlyURL = /\(((?:\/|https?:\/\/).*)\)/g;
  const together = /\[(.*)\]\(((?:\/|https?:\/\/).*)\)/gi;
  let arrayOfObjects = []

    arrayPathdMD.forEach((path)=>{
      const filesContent = fs.readFileSync(path,'utf-8')
      const dateArrayLinks = filesContent.match(together)
      let arrayObj = []
    
      if (dateArrayLinks) {
        dateArrayLinks.forEach((dataLink)=>{
          // Le quito los corchetes con (join) y luego los parentesisi con(slice)
          const link = dataLink.match(onlyURL).join().slice(1,-1)
          const text = dataLink.match(onlyText).join().slice(1,-1)

          const newObject = {
            href : link,
            text : text.substring(0, 50),
            file : path
          }
          arrayObj.push(newObject)
        })
      }
      arrayOfObjects.push(arrayObj)
      //console.log(arrayOfObjects)
    })
    return arrayOfObjects
}

// Array de 
// option validate: true

const statusTrue = (listArrLinks) => {
  const array = listArrLinks.map( dataLink => {
   
    const fetchDate = fetch(dataLink.href) 
    .then((response) => {
      console.log(response)
      const status = response.status;
      const message = response.status >= 200 && response.status <= 299 ? response.statusText : 'Fail';
      return {
        href: dataLink.href,
        text: dataLink.text,
        file: dataLink.file,
        status: status,
        ok: message,
      }

    })
    .catch(() => {
      return {
        href: dataLink.href,
        text: dataLink.text,
        file: dataLink.file,
        status: "Failed request",
        ok: 'Fail',
      }
    })
    return fetchDate
  })
  return Promise.all(array);
}









module.exports = {
  pathAbsolute,
  enteredPath,
  readDirectory,
  openDirectory,
  filterMD,
  getLink,
  statusTrue
}