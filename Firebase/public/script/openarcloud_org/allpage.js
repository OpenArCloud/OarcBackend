let badgeInterval = 8;
let killWebflowBadge = ()=>{
    let webflowbadge = document.querySelector(".w-webflow-badge");
    webflowbadge ? webflowbadge.parentElement.removeChild(webflowbadge) : undefined;
    badgeInterval*= 2;
    badgeInterval > 32000 ? badgeInterval = 32000:undefined;
    setTimeout(killWebflowBadge,badgeInterval);
}



setTimeout(killWebflowBadge,badgeInterval)
