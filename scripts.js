const messageDefault = {time: "(12:22:50)", name: "Usuário", message: "Olá, como vai? Essa é uma mensagem padrão", receiver: "Todos"};
let user = {time: "", name: "", message: "Olá", receiver: "Todos"};
login();

//funçôes de login

function login (){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(console.log(promise));
    promise.then(userLogin);
    promise.catch(serverError);
}

function userLogin(){
    user = {name: prompt("Digite o seu nome")};
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user);
    promise.then(verparticipantes);
    promise.catch(userError);
}

function verparticipantes(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(console.log(promise));
}

function serverError(error){
    if(error.response.status === 500){
        alert("Não foi possível conectar, o servidor não respondeu a solicitação");
    }
    return;
}

function userError(error){
    if(error.response.status === 400){
        alert("Não foi possível reconhecer este usuário");
        userLogin();
    }else if(error.response.status === 409){
        alert("O nome de usuário já está sendo usado na sala");
        userLogin();
    }else if(error.response.status === 422){
        alert("Nome de usuário inválido");
        userLogin();
    }
    return;
}


//funcionalidades do layout

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
