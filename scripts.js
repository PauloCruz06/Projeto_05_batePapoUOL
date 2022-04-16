const messageDefault = {time: "(12:22:50)", name: "Usuário", message: "Olá, como vai? Essa é uma mensagem padrão", receiver: "Todos"};
let user = {name: ""};
login();

//funçôes de login

function login (){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(userLogin);
    promise.catch(serverError);
}

function userLogin(){
    user = {name: prompt("Digite o seu nome")};
    const promiseLogin = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user);
    promiseLogin.then(getParticipants);
    promiseLogin.then(setInterval(userStatus, 4000));
    promiseLogin.then(setInterval(getMessages, 2000));
    promiseLogin.catch(userError);
}

function getParticipants(){
    const promisePart = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promisePart.then(console.log(promisePart));
    promisePart.then(setParticipants);
}

function setParticipants(part){
    console.log(part.data);
}

function userStatus(){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", user);
    console.log("Status: Ok");
}


//funções de mensagem

function getMessages(){
    const promiseGetMens = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promiseGetMens.then(console.log(promiseGetMens));
    promiseGetMens.then(setMessages);
}

function setMessages(mess){
    console.log(mess.data);
}


//funçôes de erro

function serverError(error){
    if(error.response.status === 500){
        alert("Não foi possível conectar, o servidor não respondeu a solicitação");
    }
    return;
}

function userError(error){
    if(error.response.status === 400){
        alert("Não foi possível reconhecer o nome de usuário ou já está existente na sala");
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
