const href = window.location.href
const path = window.location.pathname
const homePage = "http://localhost/scuola/museo-della-fisica/"
const page = path.split('/').pop()=="" ? "index.html" : path.split('/').pop()

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

getInstrumentsByCollocation(1).then(result=>{
  for(const element of result){
    console.log(element)
  }
})


fetch(`${homePage}json/instruments.json`).then(response =>{
  if(!response.ok){
    throw new Error("Errore nella richiesta")
  }
  return response.json()
}).then(data =>{
  if(page != "index.html"){
  const doc = data.find(doc => doc.id === page)
  if(doc){
    const title = doc.title
    const image = `${homePage}images/instruments/${doc.image}`
    const datation = doc.datation
    const description = doc.description
    const material = doc.material
    const keyword = doc.keyword
    const collocation = doc.collocation
    document.querySelector("#title").textContent = title
    document.querySelector("#image").innerHTML = `<img src="${image}" alt="${keyword}">`
    document.querySelector("#datation").textContent = datation
    document.querySelector("#description").innerHTML = description
    document.querySelector("#material").textContent = material
    getCollocation(collocation).then(result =>{
      
      document.querySelector("#collocation").textContent = result.name
    })
    
  }else{
    document.querySelector("#title").textContent = "Documento non trovato"
  }
  }
})

// page functions
function instrumentPreview(doc){
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
                      <nav id="strumNav"><a href="${homePage}?instrument=${id}">Vai allo Strumento</a></nav>
                    </article>`
  return htmlCode
}

function instrumentPage(doc){
  const title = doc.title
  const image = `${homePage}images/instruments/${doc.image}`
  const datation = doc.datation
  const description = doc.description
  const material = doc.material
  const keyword = doc.keyword
  const collocation = doc.collocation
  const bibliography = doc.bibliography

  let htmlCode = `<article>
                      <header>
                        <h1 id="title">${title}</h1>
                      </header>
                      <!-----------------------------End Header------------------------>
                      <!-- Image -->
                      <div id="image">
                        <img src="${image}" alt="${keyword}">
                      </div>
                      <!-- datation -->
                      <div id="datation">
                        <p>${datation}</p>
                      </div>
                      <!-- main content -->
                      <div id="description">
                        <p>${description}</p>
                      </div>
                      <!-- material -->
                      <div id="material">
                        <p>${material}</p>
                      </div>
                      <!-- collocation -->
                      <div id="collocation">
                        <p>${collocation}</p>
                      </div>`
                  
  htmlCode += `<!-- bibliografy -->
                      <div id="bibliography">
                        <p>${bibliography}</p>
                      </div>`
  htmlCode += `</article>`
  return htmlCode
}

async function home(){
  const main = document.getElementsByTagName('main')[0]
  const data = await getInstruments()
  
  let htmlCode = ``
  data.forEach(doc => {
      htmlCode += instrumentPreview(doc)
  })
  console.log(htmlCode)
  main.innerHTML = htmlCode
}

document.addEventListener('DOMContentLoaded',home)