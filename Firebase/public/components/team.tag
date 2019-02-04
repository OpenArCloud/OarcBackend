<team>
    <style>
    bio raw br {
        line-height:40px;
    }
    </style> 
    <div class="show" each={opts.team}>
        <bio img={img} name={name} title={title} bio={bio} email={email}/>
    </div>
    
    <h1>Partners & friends:</h1>
    <div class="show" each={opts.partners}>
        <partner logo={logo} name={name} url={url} ></partner>
    </div>
    
    
   
  this.on('mount', ()=>{
  
      loadJSON("content/team.json", data => {
        //console.log(data);
        let d = JSON.parse(data);
        this.opts.team = d.team;
        this.opts.partners = d.partners;
        this.update();
        //console.log(this);
      });
  
  });
</team>