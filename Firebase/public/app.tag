<app>

  <script>
    window.oarc = { menuLinkClick: (e)=>{}  };
  </script>

  <div class="header">
    <div class="topstuff">
      <a href="home"><img class="logo" src="img/OpenARCloudLogo_onDark.svg" alt="Site logo"/></a>
      <button id="menubutton" class="menubutton" ></button>
    </div>
    <div id="menu" class="menu">
      <a href="about" onClick={window.oarc.menuLinkClick.bind(this)}>About</a>
      <a href="team" onClick={window.oarc.menuLinkClick.bind(this)}>Team</a>
      <a href="standards" onClick={window.oarc.menuLinkClick.bind(this)}>Standards</a>
      <a href="projects" onClick={window.oarc.menuLinkClick.bind(this)}>Projects</a>
      <a href="blog" onClick={window.oarc.menuLinkClick.bind(this)}>Blog</a>
      <a href="faq" onClick={window.oarc.menuLinkClick.bind(this)}>FAQ</a>
  
    </div>
  </div>
  <div class="content" id="content">
      <div id="home" class="show">
          <h1>Creating the Open AR-Cloud!</h1>
          <p>This is an invitation to everyone who would like to participate in creating an AR-Cloud that is built on open standards, open data, open source and a respect for the privacy of every user of AR-Cloud solutions.</p>
          <p>Be sure to check out Norkart's <a href="blog">appeal for an Open-ARCloud community</a>, for an indepth perspective on the motivation behind starting this commuity.</b>
        <p>Stay tuned for more information in the coming days and weeks! And please sign up for our Slack community:</p>
      
      <a class="cta-button" href="https://join.slack.com/t/open-arcloud/shared_invite/enQtMzE4MTc0MTY2NjYwLWIyN2E4YmYxOTA4MWNkZmI5OGQ4Mjg2MGYzNTc4OTRkN2RjZGUxOTc4YjJhOTQ0Nzc3OWMxYTA3ZDMxNGEzMGE">Open-ARCloud.slack.com</a>
      
      </div>
      
      <div id="about">
          <h1>About Open-ARCloud.org</h1>
          <p>This website is maintained by an informal working group consisting of people who has an interest in developing an Open AR-Cloud</p>
          <p>Please read Norkart's <a href="blog">appeal for an Open-ARCloud community</a>, for an indepth perspective on the motivation behind starting this commuity.</b>
        
      </div>
      
      <div id="team">
           <team></team>       
      </div>
      
      
      <div id="standards">
          <h1>Standards</h1>
          <p>Standards are a fundamental requirement for an AR-cloud to be successfull on all sorts of devices on all sorts of platforms. In an open AR-Cloud the standards should be developed, tested and agreed upon in the open. The Open-ARCloud initiative hopes create a community that will contribute to such standards. Please go to our <a  href="https://join.slack.com/t/open-arcloud/shared_invite/enQtMzE4MTc0MTY2NjYwLWIyN2E4YmYxOTA4MWNkZmI5OGQ4Mjg2MGYzNTc4OTRkN2RjZGUxOTc4YjJhOTQ0Nzc3OWMxYTA3ZDMxNGEzMGE">slack-channel</a> to join the discussion!</p>
          
          <h2>GeoPose / Geographical 6 degrees of freedom</h2>
          <p>One of the building blocks of an open AR-cloud could be to have a globally agreed upon description of the geographical position and orientation of an AR device, or virtual object. The combination of position and orientation in AR is often referred to as "pose", thus a geographical pose could be named "GeoPose" to make it a more specific term. This type of description could be used to create a way to persist AR-content in the same physical location oriented in the same way over time for any user on any device by attaching GeoPose to the AR-content, to visualize geospatial data onsite by determining the GeoPose of the local ar coordinate system of the AR-device or enable shared multiuser AR-experiences by sharing the GeoPose of each users device. For such a description to work across the world one needs to agree on global reference frames for the parameters of the descriptor, such as what model to use to describe altitude at any geographical location. </p>
          
          <p>Sometimes 6 degrees of freedom is a term used for the same type of concept, however, combining the words Geography and Pose into GeoPose is quite succinct and could convey a more specific meaning more effectively. The naming is of course secondary to the actual content and functionality of the standard.</p>
          
          <p>Please join the standards channel at <a  href="https://join.slack.com/t/open-arcloud/shared_invite/enQtMzE4MTc0MTY2NjYwLWIyN2E4YmYxOTA4MWNkZmI5OGQ4Mjg2MGYzNTc4OTRkN2RjZGUxOTc4YjJhOTQ0Nzc3OWMxYTA3ZDMxNGEzMGE">Open-ARCLoud.slack.com</a> to contribute!</p>
          
          
          
        
      </div>
      
      <div id="projects">
          <h1>Projects</h1>
          <p>A couple of projects are in the early phase. Stay tuned.</p>
          <h2>GitHub account</h2>
          <p>We have registered a <a href="https://github.com/openarcloud">GitHub account</a>. If you go on the <a  href="https://join.slack.com/t/open-arcloud/shared_invite/enQtMzE4MTc0MTY2NjYwLWIyN2E4YmYxOTA4MWNkZmI5OGQ4Mjg2MGYzNTc4OTRkN2RjZGUxOTc4YjJhOTQ0Nzc3OWMxYTA3ZDMxNGEzMGE">Open-ARCloud slack-channel</a> and follwo the instructions you can be added as member.</p>
    </div>
    
    <div id="blog">
          <blog></blog>


        
    </div>
    
        
      
      <div id="faq">
          <faq/>      
      </div>
  </div>
  <!--<div class="footer">Footer</div>-->

  <script>
  
  

  this.on('mount', ()=>{
    //this.currentRoute = "home";
    
    let contentCont = document.getElementById('content');
    


    let menu = document.getElementById("menu");
    let toggleOn = false;
    
    let setMenuVisibility= (visible)=>{
        visible? (menu.classList.add('show')) :(menu.classList.remove('show')); 
    }
    
    let menuToggle = (event)=>{
      toggleOn = !toggleOn;
      //toggleOn? (menu.classList.add('show')) :(menu.classList.remove('show'));
      setMenuVisibility(toggleOn);
    }
    

    
    let setRoute = (routeid)=>{
        let childDivs = [];
        for (var i = 0; i < contentCont.children.length; i++) {
        childDivs.push(contentCont.children[i]);
            childDivs.forEach((div)=>{
                div.classList.remove('show')
            });
        }
        route(routeid);
        let routeContent = document.getElementById(routeid);
        if(routeContent != null){
            routeContent.classList.add('show');
        }
    
  }
  
 
    let myRoutes = ['home', 'about','standards', 'projects', 'team', 'faq', 'blog'];

    let routeHandler = (name)=>{
        let n = name ? name.toLowerCase() : '___';
        if(myRoutes.indexOf(n) != -1){
            console.log("route: " + n);
            if(this.currentRoute != n){
                
                setRoute(n);
                this.currentRoute = n;
            } else {
                console.log("current route again");
            }
            toggleOn = false;
            menu.classList.remove('show');
          } else {
              //setRoute("home");
              console.log("route NOT found");
          }
    };


    let blogHandler = (year, month, day, name)=>{
        console.log("bloghandler");
        console.log(year + month + day + name);
    }
      
      

    //route('/blog', blogHandler );  
    //route('/blog/*-*-*/*', blogHandler);
    route('/#*', routeHandler);
    route('/*', routeHandler);
   
  
    
    window.oarc.menuLinkClick = (e)=>{
        routeHandler(e.target.href.split('/').pop());
    };

    let menuButton = document.getElementById("menubutton");
    menuButton.onclick =menuToggle;
    
    if(window.initialRoute != undefined) {
        routeHandler(window.initialRoute);
    }
    

  })
    
  </script>
</app>