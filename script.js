const href = window.location.href
const path = window.location.pathname
const homePage = href.replace(path, "/")
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