const href = window.location.href
const path = window.location.pathname
const homePage = "http://localhost/scuola/museo-della-fisica/" //"https://iisbafile.edu.it/webspace/museofisica/"
const page = path.split('/').pop()=="" ? "index.html" : path.split('/').pop()

// functions 
function getQueryStringValue(key){
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(key)
}

// Async function to fetch JSON data

async function getJson(url) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data // This now waits for the fetch to complete.
  } catch (error) {
    console.error('Fetching error:', error)
  }
}

async function getInstruments(){
  const data = await getJson(`${homePage}json/instruments.json`)
  return data
}

async function getCollocations(){
  const data = await getJson(`${homePage}json/collocation.json`)
  return data
}

async function getDataById(url,id){
  const data = await getJson(url)
  const doc = data.find(doc => doc.id === id)
  
  return doc
  
}

// get instrument by collocation
async function getInstrumentsByCollocation(collocation){
  const data = await getJson(`${homePage}json/instruments.json`)
  const docs = data.filter(doc => doc.collocation === collocation)

  return docs

}

// get data by id
async function getCollocation(id){
  collocation = await getDataById(`${homePage}json/collocation.json`,
     id)
  return collocation  
}

// page functions
function instrumentPreview(doc){
  let link = `${homePage}?instrument=${doc.id}`
  if(col){
    link = `${homePage}?instrument=${doc.id}&collocation=${col}`
  }
  const id = doc.id
  const image = doc.image
  const title = doc.title
  const description = doc.subtitle
  const htmlCode = `<article id="strum">
                      <div id="strumDescription">    
                        <img src="images/instruments/${image}">
                        <div>
                          <h1>${title}</h1>
                          <p>${description}</p>
                        </div>
                      </div>
                      <nav id="strumNav"><a href="${link}">Vai allo Strumento</a></nav>
                    </article>`
  return htmlCode
}

function instrumentView(doc,backLink = homePage){
  const title = doc.title
  const image = `${homePage}images/instruments/${doc.image}`
  const datation = doc.datation
  const description = doc.description
  const material = doc.material
  const keyword = doc.keyword
  const collocation = doc.collocation
  const bibliography = doc.bibliography

  let htmlCode = `<main id="instrument">
                    <article>
                      <header>
                        <h1 id="title">${title}</h1>
                      </header>
                        <a href="${backLink}" class="back-link">🔙</a>
                      <!-----------------------------End Header------------------------>
                      <!-- Image -->
                      <div id="image">
                        <img src="${image}" alt="${keyword}">
                      </div>
                      <!-- datation -->
                      <div id="datation">
                        <p><b>DATA</b> ${datation}</p>
                      </div>
                      <!-- main content -->
                      <div id="description">
                        <p><b>DESCRIZIONE</b> ${description}</p>
                      </div>
                      <!-- material -->
                      <div id="material">
                        <p><b>MATERIALI:</b> ${material}</p>
                      </div>
                      `
  if(bibliography != ""){                
    htmlCode += `<!-- bibliografy -->
                      <div id="bibliography">
                        <p><b>BIBLIOGRAFIA</b> ${bibliography}</p>
                      </div>`
  }
  htmlCode += `</article>
              </main>`
  return htmlCode
}

// page variables
let instrument = getQueryStringValue('instrument')
let col = getQueryStringValue('collocation')

// home page

async function home(){
  const main = document.getElementsByTagName('main')[0]
  const data = await getInstruments()
  
  let htmlCode = ``
  data.forEach(doc => {
      htmlCode += instrumentPreview(doc)
  })
  main.innerHTML = htmlCode
}

async function instrumentPage(){
  let backLink = homePage
  if(col){
    backLink = `${homePage}?collocation=${col}`
  }
  const body = document.body
  body.classList.add('bg_gray')
  const doc = await getDataById(`${homePage}json/instruments.json`,instrument)
  let htmlCode = instrumentView(doc,backLink)
  
  body.innerHTML = htmlCode
}

async function collocationPage(){

  docs = await getInstrumentsByCollocation(Number(col))
  const main = document.getElementsByTagName('main')[0]
  let htmlCode = ``
  docs.forEach(doc => {
    htmlCode += instrumentPreview(doc)
  })
  main.innerHTML = htmlCode
}

async function navTag(){
  const data = await getCollocations()
  const nav = document.querySelector('.menu')
  let htmlCode = `<ul>`
  htmlCode += `<li><a href="${homePage}">HOME</a></li>`
  data.forEach(doc => {
    htmlCode += `<li><a href="${homePage}?collocation=${doc.id}">${doc.name.toUpperCase()}</a></li>`
  })
  htmlCode += `</ul>`
  nav.innerHTML = htmlCode
}
let backLink = homePage
// site navigation
if(instrument){
  document.addEventListener('DOMContentLoaded',instrumentPage)
}else if(col){
  document.addEventListener('DOMContentLoaded',navTag)
  document.addEventListener('DOMContentLoaded',collocationPage)
}else{
  backLink = homePage
  document.addEventListener('DOMContentLoaded',navTag)
  document.addEventListener('DOMContentLoaded',home)
}