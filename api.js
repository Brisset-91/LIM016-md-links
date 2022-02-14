const {
  pathAbsolute,
  enteredPath,
  readDirectory,
  openDirectory,
  filterMD,
  getLink,
  statusTrue
} = require ('./md-link.js')

const file = './Files'

const  mdLinks = (path, option = {validate:false}) => {
  
  return new Promise ((resolve, reject)=>{
    let arrayMD = []

    if (enteredPath(file)) {
      const pathValue = pathAbsolute (file)

      if (openDirectory(file).length > 0) {
        arrayMD = filterMD(openDirectory(file))
      
      } else {
        console.log('No hay contenido de archivos md')
      }

    if (arrayMD.length > 0) {
      const arrLinks = getLink(arrayMD)
      
      if (arrLinks.length>0) {

        if (option.validate) {
          statusTrue(arrLinks.flat())
           .then(response => console.log(response)) 
           
        } else {
          resolve(arrLinks.flat())
        }
      } else {
        console.log('el archivo md no contiene link')
      }
      
    } else {
      console.log('no hay archivos md')
    }
  } else {
      console.log('la ruta ingresada no existe')
    }
  })
  
  

}


mdLinks (file, {validate:true})


module.exports = () => {
  mdLinks
};