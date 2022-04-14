const messageDefault = {time: "(12:22:50)", name: "Usuário", message: "Olá, como vai? Essa é uma mensagem padrão", receiver: "Todos"};

function sendMessage(){
    const box = document.querySelector(".conteiner");
    box.innerHTML += `<div class="message"><p><light>${messageDefault.time}</light> <b>${messageDefault.name}</b> para <b>${messageDefault.receiver}</b>: ${messageDefault.message}</p></div>` 
}

function openMenu(){
    const menu = document.querySelector(".participants");
    if(menu.classList.contains("hidden")){
        menu.classList.remove("hidden");
    }else{
        menu.classList.add("hidden");
    }
}