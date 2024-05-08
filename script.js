const path = window.location.pathname
const page = path.split('/').pop()=="" ? "index.html" : path.split('/').pop()
console.log(page)
fetch("json/prova.json").then(response =>{
  if(!response.ok){
    throw new Error("Errore nella richiesta")
  }
  return response.json()
}).then(data =>{
  if(page != "index.html"){
  const doc = data.find(doc => doc.id === page)
  if(doc){
    const title = doc.title
    const subtitle = doc.subtitle
    const content = doc.content
    document.querySelector("#title").textContent = title
    document.querySelector("#subtitle").textContent = subtitle
    document.querySelector("#content").innerHTML = content
  }else{
    document.querySelector("#title").textContent = "Documento non trovato"
  }
  }
})

// Fetch the JSON file
fetch('json/folderStructure.json')
  .then(response => response.json())
  .then(data => {
    const folderStructureElement = document.getElementById('folderStructure');
    data.folders.forEach(folder => {
      const folderElement = document.createElement('div');
      folderElement.innerHTML = `<strong>${folder.name}</strong>`;
      folder.files.forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.textContent = file.name;
        folderElement.appendChild(fileElement);
      });
      folderStructureElement.appendChild(folderElement);
    });
  })
  .catch(error => console.error('Error loading the folder structure:', error));