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
    promiseLogin.then(setInterval(getParticipants, 5000));
    promiseLogin.then(setInterval(userStatus, 4000));
    promiseLogin.then(setInterval(getMessages, 2000));
    promiseLogin.catch(userError);
}

function getParticipants(){
    const promisePart = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    //promisePart.then(console.log(promisePart));
    promisePart.then(setParticipants);
}

function setParticipants(part){
    //console.log(part.data);
    document.querySelector(".menu :nth-child(2)").innerHTML = "";
    document.querySelector(".menu :nth-child(2)").innerHTML = `<div class="select contact"><ion-icon name="people"></ion-icon><p>Todos<ion-icon name="checkmark-sharp"></ion-icon></p></div>`
    for(let i=0; i<part.data.length; i++){
        document.querySelector(".menu :nth-child(2)").innerHTML += `<div class="select contact"><ion-icon name="people"></ion-icon><p>${part.data[i].name}<ion-icon class="hidden" name="checkmark-sharp"></ion-icon></p></div>`
    }
}

function userStatus(){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", user);
    console.log("Status: Ok");
}


//funções de mensagem

function getMessages(){
    const promiseGetMens = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    //promiseGetMens.then(console.log(promiseGetMens));
    promiseGetMens.then(setMessages);
}

function setMessages(mess){
    //console.log(mess.data);
    const arrmax = mess.data.length;
    let cont = 30;
    let j = arrmax;
    document.querySelector(".conteiner").innerHTML = "";
    while(cont >= 0){
        j--;
        cont--;
    }
    for(let i=j; i<arrmax; i++){
        if(mess.data[i].type === "message"){
            document.querySelector(".conteiner").innerHTML += `<div class="message"><p><light>(${mess.data[i].time})</light> <b>${mess.data[i].from}</b> para <b>${mess.data[i].to}</b>: ${mess.data[i].text}<p></div>`;    
        }else if(mess.data[i].type === "status"){
            document.querySelector(".conteiner").innerHTML += `<div class="message type-status"><p><light>(${mess.data[i].time})</light> <b>${mess.data[i].from}</b> ${mess.data[i].text}<p></div>`;
        }else{
            ocument.querySelector(".conteiner").innerHTML += `<div class="message type-private"><p><light>(${mess.data[i].time})</light> <b>${mess.data[i].from}</b> para <b>${mess.data[i].to}</b>: ${mess.data[i].text}<p></div>`;
        }
        
    }
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
    //document.querySelector(".contact p ion-icon").classList.toggle("hidden");
}
