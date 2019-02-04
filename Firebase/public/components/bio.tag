<bio class="bio">
    <img src={opts.img}/>
    <biocontent>
        <h2>{opts.name}</h2>
        <h3>{opts.title}</h3>
        <p><raw html={opts.bio}/></p>
        <a if={opts.email} href={"mailto:" +opts.email} class="email">{opts.email}</a>
    </biocontent>
</bio>