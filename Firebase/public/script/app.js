
let loadFile = (file, callback, error, mimetype) => {
    let rawFile = new XMLHttpRequest();
    mimetype && rawFile.overrideMimeType(mimetype);
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = () => {
        if((rawFile.readyState === 4) && (rawFile.status === 200 || rawFile.status == 0)){
                callback && callback(rawFile.responseText);
        }
    }
    rawFile.onerror = error;
    rawFile.onloadend = ()=>{ (rawFile.status == 404) && error("File not found (404)"); }
    rawFile.send(null);
}




let loadJSON = (file, callback, error) =>{ loadFile(file,callback, error, "application/json") }

let readTextFile = (file, callback, error)=>{ loadFile(file,callback, error)} 
                                      
                                   
                                      
async function asyncLoadJSON(file){
    let promise = await new Promise((resolve,reject) =>{
        loadJSON(file, result =>{
            result && resolve(JSON.parse(result));  
        }, (error) =>{ 
            reject(error);
        });
    }).catch(err => {console.log("Error loading JSON-file: " + file)});
    return promise;

}
  
async function asyncLoadAllJSONS(files){
    promises = [];
    files.forEach(f=>{
        promises.push(asyncLoadJSON(f));
    })
    
    try{
        return await Promise.all(promises);
    } catch(error){
        console.log("error loading JSONS");
        return [];
    }
}

const statvars = {
    months: ["January", "Ferbruary", "March", "April", "May", "June", "July", "August", "September", "Oktober", "November", "Desember"]
}

// YYYY-MM-DD -> Day. Month Year
let simpleDateToPrettyDate = (simpleDate) =>{
    let parts = simpleDate.split('-');
    let year = parts[0];
    let month = parseInt(parts[1]);
    let day = parseInt(parts[2]);
    
    return day + ". " + statvars.months[month-1] + " " + year;
 }

md = new markdownit();