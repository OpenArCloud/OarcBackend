<blog>
    <div class="show article" each={opts.features}>
        <article 
            title={title} 
            author={author}
            date={date} 
            subtitle={subtitle}
            pretitle={pretitle} 
            entry={entry} 
            content={content}
            showcontent={true}/>
    </div>
    

    
  

this.on('mount', ()=>{

      loadJSON("content/blog/articles.json", data => {
        //console.log(data);
        let d = JSON.parse(data);
        let path = 'content/blog/articles/';
    
        let features = d.featured;
        let files = features.map( feature =>{
            return path + feature + '.json';
        });
    
        let context = this;

        (async function(){ 
            let arr = await asyncLoadAllJSONS(files);
            arr = arr.map(file => {
                file.date = simpleDateToPrettyDate(file.date);
                return file;
            }); 
            console.log(arr);
            context.opts.features = arr;
            context.update();
        })();
        
  
    });
});
    
    
</blog>

/*
"pretitle":"Creating the Open AR-Cloud",
    "title":"Norkart's appeal for an open AR-Cloud community",
    "subtitle":undefined,
    "author":"Jan-Erik Vinje, Senior AR Architect and lead developer at Norkart AS and main contact for the Open-ARCloud initiative",
    "date":"2018-03-01",
    "entry":"In this article <a href=\"https://www.norkart.no\">Norkart AS</a>, a medium sized Norwegian company of 160 employees, providing geospatial solutions and services will present the story behind what motivated us to start the informal Open-ARCloud initiative and hopefully inspire you to join in on the historic endeavor of creating an open AR-Cloud together with us.",*/