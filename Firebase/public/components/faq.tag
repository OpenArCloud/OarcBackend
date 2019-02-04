<faq>
    <h1>Frequently asked questions</h1>
    <div class="show" each={opts.questionsandanswers}>
        <qanda question={q} answer={a}/>
    </div>

    this.on('mount', ()=>{

      loadJSON("content/faq.json", data => {
          this.opts.questionsandanswers = JSON.parse(data);
          this.update();
      }, e =>{
        console.log("Error parsing FAQ")
      });

    });

</faq>