

function openMenu(){
    const menu = document.querySelector(".participants");
    if(menu.classList.contains("hidden")){
        menu.classList.remove("hidden");
    }else{
        menu.classList.add("hidden");
    }
}