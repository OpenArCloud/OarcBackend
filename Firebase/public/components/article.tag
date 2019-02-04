<article>
    <h3 if={opts.pretitle}>{opts.pretitle}</h3>
    <h1>{opts.title}</h1>
    <h3 if={opts.subtitle}>{opts.subtitle}</h3>
    <p>By {opts.author}</p>
    <p><b>{opts.date}</b></p>
    <p style="font-size:1.3em"><raw html={opts.entry}/></p>
    <div if={opts.rendered}><raw html={opts.rendered}/></div>
    
    this.on('mount', ()=>{
    
        if(this.opts.showcontent){
            let path = 'content/blog/articles/';
            let file = this.opts.content ? path + this.opts.content : undefined;
            file && readTextFile(file, markdown => {
                this.opts.rendered = md.render(markdown);
                this.update();
            }, e => {
                console.log("Error loading markdown file: " + file);
            });
        }
       
    
    });
</article>